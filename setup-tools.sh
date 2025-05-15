#!/bin/bash
set -e

echo "⚙️ Configurando herramientas de desarrollo..."

# --- Backend Tool Setup ---
echo "🛠️ Configurando herramientas de backend..."

# Crear directorios de herramientas para bot y controller
mkdir -p bot/tools
mkdir -p controller/tools

# Descargar Google Java Format para bot y controller
echo "Descargando Google Java Format..."
curl -L https://github.com/google/google-java-format/releases/download/v1.15.0/google-java-format-1.15.0-all-deps.jar -o bot/tools/google-java-format-1.15.0-all-deps.jar
curl -L https://github.com/google/google-java-format/releases/download/v1.15.0/google-java-format-1.15.0-all-deps.jar -o controller/tools/google-java-format-1.15.0-all-deps.jar

# Descargar Checkstyle para bot y controller
echo "Descargando Checkstyle..."
curl -L https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.3.3/checkstyle-10.3.3-all.jar -o bot/tools/checkstyle-10.3.3-all.jar
curl -L https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.3.3/checkstyle-10.3.3-all.jar -o controller/tools/checkstyle-10.3.3-all.jar

# --- Frontend Tool Setup ---
echo "🎨 Configurando herramientas de frontend..."
cd frontend

# Verificar si package.json existe
if [ ! -f package.json ]; then
  echo "⚠️ No se encontró package.json en frontend/. Creando uno vacío e inicializando..."
  npm init -y
fi

# Instalar dependencias de desarrollo del frontend
echo "Instalando dependencias de frontend (prettier, biome)..."
# Verificar si prettier y biome ya están en devDependencies
if ! grep -q '"prettier"' package.json || ! grep -q '"@biomejs/biome"' package.json; then
  npm install --save-dev prettier @biomejs/biome
else
  echo "Prettier y Biome ya están instalados."
fi

# Actualizar package.json para incluir scripts de formato y lint
echo "Asegurando scripts 'format' y 'lint' en package.json..."
npm pkg set scripts.format="prettier --write ." || echo "No se pudo establecer el script format."
npm pkg set scripts.lint="npx biome check --apply ." || echo "No se pudo establecer el script lint." # Added --apply for auto-fixing

# Configurar archivos de configuración si no existen
echo "Configurando archivos de prettier y biome si no existen..."

# Configuración de Prettier (.prettierrc.json)
if [ ! -f .prettierrc.json ]; then
cat > .prettierrc.json << EOF
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
fi

# Configuración de Biome (biome.json)
if [ ! -f biome.json ]; then
cat > biome.json << EOF
{
  "\$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
EOF
fi

# Volver al directorio raíz
cd ..

# --- Git Hook Setup ---
echo "⚓ Configurando Git hooks..."
mkdir -p .git/hooks

# Copiar scripts de hooks (asumiendo que pre-commit.sh y pre-push.sh están en el root)
if [ -f pre-commit.sh ] && [ -f pre-push.sh ]; then
  cp pre-commit.sh .git/hooks/pre-commit
  cp pre-push.sh .git/hooks/pre-push
  echo "Hooks copiados a .git/hooks/"
else
  echo "⚠️ Advertencia: pre-commit.sh o pre-push.sh no encontrados en el directorio raíz. No se copiaron los hooks."
fi

# Hacer ejecutables los scripts relevantes
chmod +x setup-tools.sh
if [ -f .git/hooks/pre-commit ]; then chmod +x .git/hooks/pre-commit; fi
if [ -f .git/hooks/pre-push ]; then chmod +x .git/hooks/pre-push; fi
if [ -f pre-commit.sh ]; then chmod +x pre-commit.sh; fi
if [ -f pre-push.sh ]; then chmod +x pre-push.sh; fi

echo "✅ Configuración completada. El entorno de desarrollo está listo." 