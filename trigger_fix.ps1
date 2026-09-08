try {
    $headers = @{ 'Accept' = 'application/json' }
    $r = Invoke-WebRequest -Uri 'https://somoscomunidad.dataholics.com.mx/api/auth/fix-password' -UserAgent 'Mozilla/5.0' -Headers $headers -TimeoutSec 15
    Write-Host $r.Content
} catch {
    Write-Host "Status:" $_.Exception.Response.StatusCode
    Write-Host "Error:" $_.Exception.Message
}
