
Add-Type -AssemblyName System.Drawing

$sourcePath = "$PSScriptRoot/../../icon.png"
$destPath = "$PSScriptRoot/../../build/icon.ico"

if (-not (Test-Path $sourcePath)) {
    Write-Error "Source icon.png not found at $sourcePath"
    exit 1
}

# Ensure build directory exists
$buildDir = Split-Path $destPath
if (-not (Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir -Force
}

try {
    # Load the image
    $img = [System.Drawing.Image]::FromFile($sourcePath)
    
    # Create icon file stream
    $fs = [System.IO.File]::Open($destPath, [System.IO.FileMode]::Create)
    
    # Write ICO header (0,0,1,1) - 1 image
    $binaryWriter = New-Object System.IO.BinaryWriter($fs)
    $binaryWriter.Write([int16]0) # Reserved
    $binaryWriter.Write([int16]1) # Type (1=Icon)
    $binaryWriter.Write([int16]1) # Count
    
    # Create resized bitmap (256x256 is standard large icon)
    # We'll just use the source image and resize to 256x256 for simplicity, 
    # or assume input is square and reasonable size.
    # Ideally should be multi-size, but let's do a single high-res for now.
    $size = 256
    $bmp = New-Object System.Drawing.Bitmap($img, $size, $size)
    
    # Convert bitmap to PNG in memory
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytes = $ms.ToArray()
    
    # Write directory entry
    $binaryWriter.Write([byte]$size)   # Width (0 = 256)
    $binaryWriter.Write([byte]$size)   # Height (0 = 256)
    if ($size -eq 256) {
        $fs.Seek(-2, [System.IO.SeekOrigin]::Current)
        $binaryWriter.Write([byte]0)
        $binaryWriter.Write([byte]0)
    }
    
    $binaryWriter.Write([byte]0)       # ColorCount
    $binaryWriter.Write([byte]0)       # Reserved
    $binaryWriter.Write([int16]1)      # Planes
    $binaryWriter.Write([int16]32)     # BitCount (32 for PNG)
    $binaryWriter.Write([int32]$pngBytes.Length) # SizeInBytes
    $binaryWriter.Write([int32]22)     # Offset (6+16=22)
    
    # Write image data
    $binaryWriter.Write($pngBytes)
    
    $binaryWriter.Close()
    $fs.Close()
    
    Write-Host "Successfully converted icon.png to build/icon.ico"
} catch {
    Write-Error "Failed to convert icon: $_"
    exit 1
}
