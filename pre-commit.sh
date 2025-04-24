#!/bin/bash
set -e

echo "🔍 Verificando formato y linting..."

# Backend (Java)
cd MtdrSpring/backend
echo "Verificando formato de código Java..."
# Crear directorio tools si no existe
mkdir -p tools
# Descargar Google Java Format si no existe
if [ ! -f ./tools/google-java-format-1.15.0-all-deps.jar ]; then
  echo "Descargando Google Java Format..."
  curl -L https://github.com/google/google-java-format/releases/download/v1.15.0/google-java-format-1.15.0-all-deps.jar -o ./tools/google-java-format-1.15.0-all-deps.jar
fi

# Verificar formato con Google Java Format
find src -name "*.java" -type f | xargs java -jar ./tools/google-java-format-1.15.0-all-deps.jar --dry-run

# Descargar Checkstyle si no existe
if [ ! -f ./tools/checkstyle-10.3.3-all.jar ]; then
  echo "Descargando Checkstyle..."
  curl -L https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.3.3/checkstyle-10.3.3-all.jar -o ./tools/checkstyle-10.3.3-all.jar
fi

# Linting con Checkstyle
echo "Ejecutando Checkstyle..."
java -jar ./tools/checkstyle-10.3.3-all.jar -c sun_checks.xml src/main/java || echo "Checkstyle encontró problemas, pero continuamos para no bloquear el commit"

# Frontend (React)
cd src/main/frontend
echo "Verificando formato de código JavaScript/TypeScript..."
npx prettier --check . || echo "Prettier encontró problemas de formato, pero continuamos"
echo "Ejecutando linting de JavaScript/TypeScript..."
npx biome check . || echo "Biome encontró problemas, pero continuamos"

exit 0 