#!/bin/bash
set -e

# --- Configuration ---

# General
TARGET_URL="https://example.com" # Use host.docker.internal to access the frontend from the host machine (http://localhost:3000)
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


# == ZAP Scan Section ==
#: '
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
#'

# == Sn1per Scan Section ==
log_step "Setting up and running Sn1per Scan using BlackArch Docker image"

log_info "Running BlackArch Linux container..."
docker run -i --rm \
  -v "${HOST_RESULTS_DIR}:/results" \
  docker.io/blackarchlinux/blackarch:latest bash -c "\
    echo '[INFO] Upgrading system...' && \
    pacman -Syu --noconfirm && \
    echo '[INFO] Installing sn1per from official repository...' && \
    pacman -Sy sn1per --noconfirm && \
    ln -s /usr/bin/sn1per /usr/bin/sniper && \
    echo '[INFO] Running sn1per against target: ${TARGET_URL}' && \
    /usr/bin/sn1per -t ${TARGET_URL} | tee /results/${SNIPER_LOG_FILE_NAME} 2>&1 \
  " || log_error "BlackArch Sn1per scan failed."

log_info "Script finished."