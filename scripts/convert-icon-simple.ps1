
try {
    Add-Type -AssemblyName System.Drawing
} catch {
    Write-Error "System.Drawing assembly not found."
    exit 1
}

$sourcePath = "icon.png"
$destPath = "build/icon.ico"

# Check if source exists relative to current location
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source icon.png not found at $PWD/$sourcePath"
    exit 1
}

# Ensure build directory exists
if (-not (Test-Path "build")) {
    New-Item -ItemType Directory -Path "build" -Force | Out-Null
}

try {
    $img = [System.Drawing.Image]::FromFile((Resolve-Path $sourcePath))
    $size = 256
    
    # Create resized bitmap
    $bmp = New-Object System.Drawing.Bitmap($img, $size, $size)
    
    # Convert bitmap to PNG in memory
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytes = $ms.ToArray()
    
    # Open file stream for writing
    $fs = [System.IO.File]::Open($destPath, [System.IO.FileMode]::Create)
    $writer = New-Object System.IO.BinaryWriter($fs)
    
    # --- ICO Header ---
    $writer.Write([int16]0) # Reserved
    $writer.Write([int16]1) # Type (1=Icon)
    $writer.Write([int16]1) # Count (1 image)
    
    # --- Directory Entry ---
    $width = if ($size -ge 256) { 0 } else { $size }
    $height = if ($size -ge 256) { 0 } else { $size }
    
    $writer.Write([byte]$width)
    $writer.Write([byte]$height)
    $writer.Write([byte]0)       # ColorCount
    $writer.Write([byte]0)       # Reserved
    $writer.Write([int16]1)      # Planes
    $writer.Write([int16]32)     # BitCount (32bpp)
    $writer.Write([int32]$pngBytes.Length) # SizeInBytes
    $writer.Write([int32]22)     # Offset (6 header + 16 entry = 22)
    
    # --- Image Data ---
    $writer.Write($pngBytes)
    
    $writer.Close()
    $fs.Close()
    
    Write-Host "Successfully converted icon.png to build/icon.ico"
} catch {
    Write-Error "Failed to convert icon: $_"
    exit 1
}
