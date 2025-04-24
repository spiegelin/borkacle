#!/bin/bash

echo "Building controller service..."

# Set executable permissions on mvnw
chmod +x mvnw

# Clean and package with Maven
./mvnw clean package -DskipTests

echo "Build completed." 