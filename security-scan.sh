#!/bin/bash
set -e

# --- Configuration ---

# General
TARGET_URL="http://host.docker.internal:3000" # Use host.docker.internal to access the frontend from the host machine (http://localhost:3000)
RESULTS_DIR_NAME="results"
HOST_RESULTS_DIR="$(pwd)/${RESULTS_DIR_NAME}" # Root directory for all scan results

# ZAP Configuration (Note: ZAP scan section is currently commented out)
ZAP_IMAGE="ghcr.io/zaproxy/zaproxy:stable"
ZAP_OUTPUT_FILE_NAME="zap-results.xml" # Specific output file name for ZAP
FULL_ZAP_OUTPUT_PATH_ON_HOST="${HOST_RESULTS_DIR}/${ZAP_OUTPUT_FILE_NAME}"
CONTAINER_ZAP_WRK_DIR="/zap/wrk" # ZAP's working directory inside its container
ZAP_OUTPUT_PATH_IN_CONTAINER="${CONTAINER_ZAP_WRK_DIR}/${ZAP_OUTPUT_FILE_NAME}" # ZAP output path inside its container

# Sn1per Configuration
SNIPER_REPO_URL="https://github.com/1N3/Sn1per.git"
SNIPER_DIR_NAME="Sn1per" # Directory name for the Sn1per tool
HOST_SNIPER_SOURCE_DIR="$(pwd)/${SNIPER_DIR_NAME}" # Local path where Sn1per source code is located or will be cloned
SNIPER_IMAGE_TO_RUN="sn1per-kali-linux" # Docker image name for running Sn1per (expected to be built by Sn1per's docker-compose)
SNIPER_LOG_FILE_NAME="sn1per-results.log" # Desired log file name for Sn1per scan
FULL_SNIPER_LOG_PATH_ON_HOST="${HOST_RESULTS_DIR}/${SNIPER_LOG_FILE_NAME}" # Full path on host for the Sn1per log
SNIPER_RESULTS_MOUNT_IN_CONTAINER="/mnt/host_results_for_sniper" # Mount point inside Sn1per container for results directory
CLONED_SNIPER_THIS_RUN=false # Flag to track if Sn1per repository was cloned during this script execution

# --- Helper Functions ---
log_info() {
  echo "[INFO] $1"
}

log_step() {
  echo
  echo "----------------------------------------------------------------------"
  echo "[STEP] $1"
  echo "----------------------------------------------------------------------"
}

log_success() {
  echo "[SUCCESS] $1"
  echo "----------------------------------------------------------------------"
  echo
}

log_error() {
  echo "[ERROR] $1" >&2
  echo "[ERROR] Exiting script: $0" >&2
  exit 1
}

# --- Main Script ---
log_step "Preparing environment for results" # General preparation, not just ZAP
log_info "Target URL: ${TARGET_URL}"
log_info "Host Results Directory: ${HOST_RESULTS_DIR}"

# This check is for the main results directory, used by both ZAP (commented) and Sn1per
if [ ! -d "${HOST_RESULTS_DIR}" ]; then
  log_info "Creating results directory: ${HOST_RESULTS_DIR}"
  mkdir -p "${HOST_RESULTS_DIR}"
  if [ $? -ne 0 ]; then
    log_error "Failed to create results directory: ${HOST_RESULTS_DIR}"
  fi
else
  log_info "Results directory already exists: ${HOST_RESULTS_DIR}"
fi

: '
# == ZAP Scan Section ==
log_step "Starting ZAP Security Scan"
log_info "ZAP Image: ${ZAP_IMAGE}"
log_info "Output File: ${ZAP_OUTPUT_FILE_NAME}" # Using new var name
log_step "Pulling ZAP Docker image (if not already present)"
docker pull "${ZAP_IMAGE}"
if [ $? -ne 0 ]; then
 log_error "Failed to pull ZAP Docker image: ${ZAP_IMAGE}"
fi
log_step "Running ZAP Scan"
log_info "Executing ZAP command..."
# Note: The ZAP container will write to ${ZAP_OUTPUT_PATH_IN_CONTAINER}, which is mapped from ${FULL_ZAP_OUTPUT_PATH_ON_HOST} on the host.
docker run --rm \
 -v "${HOST_RESULTS_DIR}:${CONTAINER_ZAP_WRK_DIR}:rw" \ # Using new var name
 "${ZAP_IMAGE}" zap.sh -cmd \
 -quickurl "${TARGET_URL}" \
 -quickout "${ZAP_OUTPUT_PATH_IN_CONTAINER}" > /dev/null # Using new var name
if [ $? -ne 0 ]; then
 log_error "ZAP scan failed. Check error output (if any) or Docker logs for the ZAP container ID if needed."
else
 log_success "ZAP Scan completed!"
 log_info "Report saved to: ${FULL_ZAP_OUTPUT_PATH_ON_HOST}" # Using new var name
fi
# == End of ZAP Scan Section ==
'

# == Sn1per Scan Section ==
log_step "Setting up and running Sn1per Scan"

log_info "Ensuring results directory exists for Sn1per log: ${HOST_RESULTS_DIR}"
mkdir -p "${HOST_RESULTS_DIR}" # Ensures results dir exists, idempotent

if [ -d "${HOST_SNIPER_SOURCE_DIR}" ]; then
  log_info "Sn1per directory ${HOST_SNIPER_SOURCE_DIR} already exists. Using existing directory."
else
  log_info "Cloning Sn1per repository from ${SNIPER_REPO_URL} into ${HOST_SNIPER_SOURCE_DIR}"
  git clone --depth 1 "${SNIPER_REPO_URL}" "${HOST_SNIPER_SOURCE_DIR}"
  if [ $? -ne 0 ]; then
    log_error "Failed to clone Sn1per repository. Exiting."
  fi
  CLONED_SNIPER_THIS_RUN=true
fi

log_info "Changing directory to Sn1per source: ${HOST_SNIPER_SOURCE_DIR}"
cd "${HOST_SNIPER_SOURCE_DIR}"
if [ $? -ne 0 ]; then
  # If cd fails, it implies HOST_SNIPER_SOURCE_DIR (cloned or existing) is not accessible.
  # The script should not proceed with docker compose operations.
  cd .. # Attempt to go back to original directory before erroring
  log_error "Failed to change directory to ${HOST_SNIPER_SOURCE_DIR}. Exiting."
fi

log_info "Bringing up Sn1per environment using Docker Compose (builds images if needed, starts services in background)..."
docker compose up --build -d
if [ $? -ne 0 ]; then
  log_info "[ATTEMPTING CLEANUP] Docker Compose up failed. Attempting to bring down services and clean up Sn1per directory if cloned..."
  docker compose down >/dev/null 2>&1 || log_info "[INFO] Docker compose down also reported an error during cleanup."
  cd ..
  if [ "${CLONED_SNIPER_THIS_RUN}" = true ]; then
    log_info "[CLEANUP] Removing cloned Sn1per directory: ${HOST_SNIPER_SOURCE_DIR}"
    rm -rf "${HOST_SNIPER_SOURCE_DIR}"
  fi
  log_error "Docker Compose up failed for Sn1per. Exiting."
fi

log_info "Running Sn1per scan in a new container using the '${SNIPER_IMAGE_TO_RUN}' image..."
log_info "Target URL: ${TARGET_URL}"
log_info "Sn1per log will be saved to host at: ${FULL_SNIPER_LOG_PATH_ON_HOST}"
log_info "Output within container will be: ${SNIPER_RESULTS_MOUNT_IN_CONTAINER}/${SNIPER_LOG_FILE_NAME}"


docker run --rm -it \
  --platform linux/amd64 \
  --add-host=host.docker.internal:host-gateway \
  -v "${HOST_RESULTS_DIR}:${SNIPER_RESULTS_MOUNT_IN_CONTAINER}:rw" \
  "${SNIPER_IMAGE_TO_RUN}" \
  bash -c "sniper -t '${TARGET_URL}' | tee '${SNIPER_RESULTS_MOUNT_IN_CONTAINER}/${SNIPER_LOG_FILE_NAME}'"

SNIPER_RUN_EXIT_CODE=$?

log_info "Sn1per scan container finished. Bringing down Docker Compose environment..."
docker compose down
if [ $? -ne 0 ]; then
  log_info "[WARNING] Docker Compose down reported an error, but continuing with script cleanup."
fi

log_info "Changing directory back to project root from Sn1per directory..."
cd ..
if [ $? -ne 0 ]; then
  log_error "Failed to change directory back to project root. Manual cleanup of ${HOST_SNIPER_SOURCE_DIR} might be needed if it was cloned this run."
fi

if [ "${CLONED_SNIPER_THIS_RUN}" = true ]; then
  log_info "Cleaning up Sn1per source directory (cloned this run): ${HOST_SNIPER_SOURCE_DIR}"
  rm -rf "${HOST_SNIPER_SOURCE_DIR}"
else
  log_info "Skipping cleanup of Sn1per source directory (used existing directory or cleanup failed earlier): ${HOST_SNIPER_SOURCE_DIR}"
fi

if [ ${SNIPER_RUN_EXIT_CODE} -ne 0 ]; then
  log_error "Sn1per scan failed. Exit code: ${SNIPER_RUN_EXIT_CODE}. Check log: ${FULL_SNIPER_LOG_PATH_ON_HOST}"
else
  # Check if the log file was actually created on the host
  if [ -f "${FULL_SNIPER_LOG_PATH_ON_HOST}" ]; then
    log_success "Sn1per Scan completed! Log saved to: ${FULL_SNIPER_LOG_PATH_ON_HOST}"
  else
    # This case might occur if tee failed or if the path mapping/permissions were incorrect, despite exit code 0
    log_info "[WARNING] Sn1per scan command completed (exit code 0), but the log file was not found at the expected host path: ${FULL_SNIPER_LOG_PATH_ON_HOST}. The log might be inside the container's results mount if there was an issue with the tee command or volume mapping persistence."
  fi
fi

log_info "Script finished."