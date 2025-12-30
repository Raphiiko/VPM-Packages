@echo off
REM Build script for VPM Package Listing (Windows)

echo ========================================
echo VPM Package Listing - Local Build
echo ========================================
echo.

REM Check if ci directory exists, if not clone it
if not exist "ci" (
    echo Cloning package-list-action...
    git clone https://github.com/vrchat-community/package-list-action.git ci
    if errorlevel 1 (
        echo Failed to clone package-list-action
        exit /b 1
    )
    echo.
) else (
    echo package-list-action already exists, updating...
    cd ci
    git pull
    cd ..
    echo.
)

REM Create build output directory
if not exist "build" mkdir build

REM Run the build
echo Running build process...
echo.
dotnet run --project ci\PackageBuilder\PackageBuilder.csproj --framework net8.0 -- BuildMultiPackageListing --root ci --list-publish-directory "%CD%\build" --package-listing-source-folder "%CD%"

if errorlevel 1 (
    echo.
    echo Build failed!
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Output directory: %CD%\build
echo.
echo To preview, open build\index.html in your browser
echo Or run a local server from the build directory:
echo   npx http-server build -p 8000
echo.
