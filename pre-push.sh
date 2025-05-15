#!/bin/bash
# Development phase: Allow push even if tests fail. Warnings will be printed.
set -e # Exit immediately if a command exits with a non-zero status (use sparingly below)

echo "🧪 Ejecutando pruebas antes del push... (Modo desarrollo: no bloqueante)"

EXIT_CODE=0 # Track overall success

# --- Backend Tests (bot service) ---
echo "[Bot Service] Ejecutando pruebas..."
cd bot
if [ -f mvnw ]; then
  set +e # Allow test failure
  ./mvnw test
  TEST_EXIT_CODE=$?
  set -e
  if [ $TEST_EXIT_CODE -ne 0 ]; then echo "⚠️ [Bot Service] Pruebas fallaron (no bloqueante)."; EXIT_CODE=1; fi
elif command -v mvn &> /dev/null; then
  set +e # Allow test failure
  mvn test
  TEST_EXIT_CODE=$?
  set -e
  if [ $TEST_EXIT_CODE -ne 0 ]; then echo "⚠️ [Bot Service] Pruebas fallaron (no bloqueante)."; EXIT_CODE=1; fi
else
  echo "⚠️ [Bot Service] No se encontró 'mvnw' ni 'mvn'. Saltando pruebas."
fi
cd ..

# --- Backend Tests (controller service) ---
echo "[Controller Service] Ejecutando pruebas..."
cd controller
if [ -f mvnw ]; then
  set +e # Allow test failure
  ./mvnw test
  TEST_EXIT_CODE=$?
  set -e
  if [ $TEST_EXIT_CODE -ne 0 ]; then echo "⚠️ [Controller Service] Pruebas fallaron (no bloqueante)."; EXIT_CODE=1; fi
elif command -v mvn &> /dev/null; then
  set +e # Allow test failure
  mvn test
  TEST_EXIT_CODE=$?
  set -e
  if [ $TEST_EXIT_CODE -ne 0 ]; then echo "⚠️ [Controller Service] Pruebas fallaron (no bloqueante)."; EXIT_CODE=1; fi
else
  echo "⚠️ [Controller Service] No se encontró 'mvnw' ni 'mvn'. Saltando pruebas."
fi
cd ..

# --- Frontend Tests ---
echo "[Frontend Service] Ejecutando pruebas..."
cd frontend
if [ ! -f package.json ]; then
  echo "⚠️ [Frontend Service] No se encontró package.json. Saltando pruebas."
elif grep -q '"test"' package.json; then
  if command -v npm &> /dev/null; then
    set +e # Allow test failure
    npm test -- --passWithNoTests
    TEST_EXIT_CODE=$?
    set -e
    if [ $TEST_EXIT_CODE -ne 0 ]; then echo "⚠️ [Frontend Service] Pruebas fallaron (no bloqueante)."; EXIT_CODE=1; fi
  else
    echo "⚠️ [Frontend Service] No se encontró 'npm'. Saltando pruebas."
  fi
else
  echo "⚠️ [Frontend Service] No se encontró script 'test' en package.json. Saltando pruebas."
fi
cd ..

if [ $EXIT_CODE -ne 0 ]; then
    echo "❌ Hubo fallos durante las pruebas pre-push (ver logs arriba)."
    # Exit with 0 anyway because we are in development phase
    echo "⚠️ Continuando con el push (modo desarrollo)."
    exit 0
fi

echo "✅ Todas las pruebas pasaron o fueron ignoradas (modo desarrollo). Procediendo con el push."
exit 0 