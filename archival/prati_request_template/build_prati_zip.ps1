param(
  [string]$LastName = "YourLastName"
)

$DateStr = Get-Date -Format yyyyMMdd
$Folder = "PRATI_REQUEST_${LastName}_${DateStr}"
$ZipName = "${Folder}.zip"

New-Item -ItemType Directory -Force -Path $Folder | Out-Null

@(
  "00_Cover_Turin_EN_IT.txt",
  "01_Cover_Alessandria_EN_IT.txt",
  "02_Cover_Essex_EN.txt",
  "03_Prati_Affidavit_scans.txt",
  "04_Provenance_Declaration_Notarized_EN_IT.txt",
  "05_Readme_Attachments.txt",
  "06_EvidenceMatrix.csv",
  "07_Executive_Summary.txt",
  "08_Italian_Push_Email.txt"
) | ForEach-Object { Copy-Item $_ -Destination $Folder -Force }

Compress-Archive -Path $Folder -DestinationPath $ZipName -Force
Write-Host "ZIP created: $ZipName"
