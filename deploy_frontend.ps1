$FTP_HOST = "ftp.dataholics.com.mx"
$FTP_USER = "SC_DEV@dataholics.com.mx"
$FTP_PASS = "b}%gI?we_2vz"
$LocalDir = "C:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\UW_SomosComunidad\frontend\dist"
$RemoteDir = "/"

Get-ChildItem -Path $LocalDir -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($LocalDir.Length).Replace('\','/')
    $url = "ftp://${FTP_HOST}${RemoteDir}${rel}"
    Write-Host "Uploading $rel"
    & curl.exe --ftp-create-dirs -T $_.FullName --user "${FTP_USER}:${FTP_PASS}" $url 2>&1
}
