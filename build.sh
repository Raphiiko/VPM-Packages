#!/bin/bash
# Build script for VPM Package Listing (Linux/Mac)

echo "========================================"
echo "VPM Package Listing - Local Build"
echo "========================================"
echo ""

# Check if ci directory exists, if not clone it
if [ ! -d "ci" ]; then
    echo "Cloning package-list-action..."
    git clone https://github.com/vrchat-community/package-list-action.git ci
    if [ $? -ne 0 ]; then
        echo "Failed to clone package-list-action"
        exit 1
    fi
    echo ""
else
    echo "package-list-action already exists, updating..."
    cd ci
    git pull
    cd ..
    echo ""
fi

# Create build output directory
mkdir -p build

# Run the build
echo "Running build process..."
echo ""
dotnet run --project ci/PackageBuilder/PackageBuilder.csproj --framework net8.0 -- BuildMultiPackageListing --root ci --list-publish-directory "$(pwd)/build" --package-listing-source-folder "$(pwd)"

if [ $? -ne 0 ]; then
    echo ""
    echo "Build failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "Build completed successfully!"
echo "========================================"
echo ""
echo "Output directory: $(pwd)/build"
echo ""
echo "To preview, open build/index.html in your browser"
echo "Or run a local server from the build directory:"
echo "  npx http-server build -p 8000"
echo ""
