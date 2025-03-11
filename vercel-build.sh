#!/bin/bash
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clear any existing build artifacts
rm -rf build

# Install dependencies
npm install

# Build the application
npm run build

# Check if build directory exists and contains files
if [ -d "build" ]; then
  echo "Build directory exists"
  ls -la build
  if [ -f "build/index.html" ]; then
    echo "index.html exists"
    cat build/index.html
  else
    echo "index.html is missing!"
  fi
else
  echo "Build directory is missing!"
fi 