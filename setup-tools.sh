#!/bin/bash
set -e

echo "⚙️ Configurando herramientas de desarrollo..."

# Crear directorio para herramientas
mkdir -p MtdrSpring/backend/tools

# Descargar Google Java Format
echo "Descargando Google Java Format..."
curl -L https://github.com/google/google-java-format/releases/download/v1.15.0/google-java-format-1.15.0-all-deps.jar -o MtdrSpring/backend/tools/google-java-format-1.15.0-all-deps.jar

# Descargar Checkstyle
echo "Descargando Checkstyle..."
curl -L https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.3.3/checkstyle-10.3.3-all.jar -o MtdrSpring/backend/tools/checkstyle-10.3.3-all.jar

# Instalar dependencias del frontend
echo "Instalando dependencias de frontend..."
cd MtdrSpring/backend/src/main/frontend

# Verificar si prettier y biome ya están instalados
if ! grep -q "prettier" package.json || ! grep -q "biome" package.json; then
  echo "Instalando prettier y biome..."
  npm install --save-dev prettier @biomejs/biome
fi

# Actualizar package.json para incluir scripts
npm pkg set scripts.format="prettier --write ."
npm pkg set scripts.lint="npx biome check ."

# Configurar archivos de configuración
echo "Configurando archivos de prettier y biome..."

# Configuración de Prettier
cat > .prettierrc.json << EOF
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF

# Configuración de Biome
cat > biome.json << EOF
{
  "$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
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

# Volver al directorio raíz
cd ../../../../../

# Instalar Git hooks
echo "Configurando Git hooks..."
mkdir -p .git/hooks

# Copiar scripts de hooks
cp pre-commit.sh .git/hooks/pre-commit
cp pre-push.sh .git/hooks/pre-push

# Hacer ejecutables los scripts
chmod +x .git/hooks/pre-commit .git/hooks/pre-push
chmod +x pre-commit.sh pre-push.sh setup-tools.sh

echo "✅ Configuración completada. El entorno de desarrollo está listo." 