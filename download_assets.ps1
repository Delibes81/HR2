
$files = @{
    "hero-base-purple.png" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Clip%20path%20group.png?alt=media&token=2486ca1b-9fbe-4305-b9de-bbf5690d9bb6"
    "hero-stick-green.png" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/stick%20holymoly%20verde_2.png?alt=media&token=ecf1a8bf-e152-4f5d-9f8e-01053535dec5"
    "hero-base-orange.png" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Clip%20path%20group(1).png?alt=media&token=e191e2f3-36b0-4b70-8112-5da6f8a8d07c"
    "hero-stick-orange.png" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/stick%20holymoly%202560x1706%20naranja(1).png?alt=media&token=2bd5a6ab-ca57-4988-a03a-3b6341dc48a1"
    "hm-video.mov" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/HM%20horizontal%20subs.mov?alt=media&token=dbb0df42-b29e-4359-8c55-dcb11051994b"
    "logo.svg" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Capa_1.svg?alt=media&token=7a5a7ccb-3bba-4771-8a79-249c423166c9"
    "halo.png" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/halo.png?alt=media&token=ce72b8ad-f32b-43f6-ae62-2df4a1ddad4e"
    "footer-logo.png" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Layer_1.png?alt=media&token=a81cf287-9b76-4cb6-9451-810bb77e1df5"
    "catalog-banner.jpg" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/front-view-young-people-dancing-party.jpg?alt=media&token=866cb7b6-28ee-4d66-a5c3-2f4e45180a62"
    "estas-crudito.png" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/ESTASCRUDITO(1).png?alt=media&token=a6eba470-eed5-4dd4-8a82-cd0bba4c1eb3"
    "team-hero.jpg" = "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/holymoly_N(2).jpg?alt=media&token=676e7bce-4bcc-4c29-b64b-25dd946ab1f5"
}

$destDir = "public/assets"
if (!(Test-Path -Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

foreach ($key in $files.Keys) {
    $url = $files[$key]
    $output = Join-Path $destDir $key
    Write-Host "Downloading $key..."
    Invoke-WebRequest -Uri $url -OutFile $output
}

Write-Host "Download complete."
