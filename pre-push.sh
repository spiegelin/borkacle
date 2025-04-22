#!/bin/bash
set -e

echo "🧪 Ejecutando pruebas antes de push..."

# Backend tests (si existen)
cd MtdrSpring/backend
echo "Verificando si hay tests de backend..."
if find src/test/java -name "*Test.java" -type f | grep -q .; then
  echo "Ejecutando pruebas de backend..."
  ./mvnw test
else
  echo "No se encontraron archivos de test Java, saltando pruebas de backend"
fi

# Frontend tests (si existen)
cd src/main/frontend
echo "Verificando si hay tests de frontend..."
if grep -q "\"test\":" package.json; then
  echo "Ejecutando pruebas de frontend..."
  npm test -- --run || npm test
else
  echo "No se encontraron scripts de test en package.json, saltando pruebas de frontend"
fi

echo "✅ Todas las pruebas pasaron. Procediendo con el push." 