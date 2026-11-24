$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:4443/storage/v1/b?project=furnique"
$body = @{ name = "furnique-backups" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri $baseUrl -ContentType "application/json" -Body $body | Out-Null
Write-Output "Created the local demo backup bucket."
