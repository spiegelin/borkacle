#!/bin/bash
# Development phase: Allow commit even if checks fail. Warnings will be printed.
set -e # Exit immediately if a command exits with a non-zero status (use sparingly below)

echo "🔍 Verificando formato y linting antes del commit... (Modo desarrollo: no bloqueante)"

EXIT_CODE=0 # Track overall success

# --- Backend Checks (bot service) ---
echo "[Bot Service] Verificando código Java..."
cd bot
if [ ! -d tools ]; then
  echo "⚠️ Directorio bot/tools no encontrado. Ejecuta setup-tools.sh primero."
  EXIT_CODE=1
else
  # Verificar formato con Google Java Format
  if [ -f ./tools/google-java-format-1.15.0-all-deps.jar ]; then
    # Use 'set +e' temporarily to prevent script exit on formatter failure
    set +e
    find src -name "*.java" -type f | xargs java -jar ./tools/google-java-format-1.15.0-all-deps.jar --dry-run --set-exit-if-changed
    FORMAT_EXIT_CODE=$?
    set -e
    if [ $FORMAT_EXIT_CODE -ne 0 ]; then
      echo "⚠️ [Bot Service] Google Java Format encontró problemas (no bloqueante)."
      # Optionally set EXIT_CODE=1 if you want the hook to fail later
    else
      echo "✅ [Bot Service] Formato OK."
    fi
  else
    echo "⚠️ Google Java Format JAR no encontrado en bot/tools/"
  fi
  # Linting con Checkstyle (commented out, requires sun_checks.xml)
  # if [ -f ./tools/checkstyle-10.3.3-all.jar ] && [ -f sun_checks.xml ]; then
  #   echo "[Bot Service] Ejecutando Checkstyle..."
  #   java -jar ./tools/checkstyle-10.3.3-all.jar -c sun_checks.xml src/main/java || echo "⚠️ [Bot Service] Checkstyle encontró problemas (no bloqueante)."
  # else
  #   echo "⚠️ Checkstyle JAR o sun_checks.xml no encontrado en bot/"
  # fi
fi
cd ..

# --- Backend Checks (controller service) ---
echo "[Controller Service] Verificando código Java..."
cd controller
if [ ! -d tools ]; then
  echo "⚠️ Directorio controller/tools no encontrado. Ejecuta setup-tools.sh primero."
  EXIT_CODE=1
elif [ -f ./tools/google-java-format-1.15.0-all-deps.jar ]; then
    # Verificar formato con Google Java Format
    set +e
    find src -name "*.java" -type f | xargs java -jar ./tools/google-java-format-1.15.0-all-deps.jar --dry-run --set-exit-if-changed
    FORMAT_EXIT_CODE=$?
    set -e
    if [ $FORMAT_EXIT_CODE -ne 0 ]; then
      echo "⚠️ [Controller Service] Google Java Format encontró problemas (no bloqueante)."
    else
      echo "✅ [Controller Service] Formato OK."
    fi
else
    echo "⚠️ Google Java Format JAR no encontrado en controller/tools/"
fi
# Linting con Checkstyle (commented out, requires sun_checks.xml)
# if [ -f ./tools/checkstyle-10.3.3-all.jar ] && [ -f sun_checks.xml ]; then
#   echo "[Controller Service] Ejecutando Checkstyle..."
#   java -jar ./tools/checkstyle-10.3.3-all.jar -c sun_checks.xml src/main/java || echo "⚠️ [Controller Service] Checkstyle encontró problemas (no bloqueante)."
# else
#   echo "⚠️ Checkstyle JAR o sun_checks.xml no encontrado en controller/"
# fi
cd ..

# --- Frontend Checks ---
echo "[Frontend Service] Verificando código..."
cd frontend
if [ ! -f package.json ]; then
  echo "⚠️ No se encontró package.json en frontend/. Saltando checks de frontend."
else
  # Verificar formato (Prettier)
  echo "Verificando formato (Prettier)..."
  if command -v npx &> /dev/null; then
    set +e
    npx prettier --check .
    PRETTIER_EXIT_CODE=$?
    set -e
    if [ $PRETTIER_EXIT_CODE -ne 0 ]; then
        echo "⚠️ [Frontend Service] Prettier encontró problemas de formato (no bloqueante)."
    else
        echo "✅ [Frontend Service] Formato OK."
    fi
  else
      echo "⚠️ Comando 'npx' no encontrado. Saltando Prettier check."
  fi

  # Linting (Biome)
  echo "Ejecutando linting (Biome)..."
   if command -v npx &> /dev/null; then
    set +e
    npx biome check .
    BIOME_EXIT_CODE=$?
    set -e
    if [ $BIOME_EXIT_CODE -ne 0 ]; then
        echo "⚠️ [Frontend Service] Biome encontró problemas (no bloqueante)."
    else
        echo "✅ [Frontend Service] Linting OK."
    fi
   else
      echo "⚠️ Comando 'npx' no encontrado. Saltando Biome check."
   fi
fi
cd ..

if [ $EXIT_CODE -ne 0 ]; then
    echo "❌ Hubo errores durante los pre-commit checks (ver logs arriba)."
    # Exit with 0 anyway because we are in development phase
    echo "⚠️ Continuando con el commit (modo desarrollo)."
    exit 0
fi

echo "✅ Todos los checks pasaron o fueron ignorados (modo desarrollo)."
exit 0 