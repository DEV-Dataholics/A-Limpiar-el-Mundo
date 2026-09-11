import os
import ftplib

FTP_HOST = "ftp.dataholics.com.mx"
FTP_USER = "DEV-UW@alimpiarelmundo.dataholics.com.mx"
FTP_PASS = "itc=imD3B=LU"

BASE_VENDOR = r"C:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\proyectos\A Limpiar el Mundo\api\vendor"

def navigate_to(ftp, remote_dir):
    ftp.cwd("/")
    parts = [p for p in remote_dir.strip("/").split("/") if p]
    for part in parts:
        try:
            ftp.cwd(part)
        except Exception:
            ftp.mkd(part)
            ftp.cwd(part)

def upload_file(ftp, local_path, remote_path):
    remote_dir = os.path.dirname(remote_path).replace("\\", "/")
    file_name = os.path.basename(remote_path)
    navigate_to(ftp, remote_dir)
    print(f"Uploading -> {remote_path}")
    with open(local_path, "rb") as fp:
        ftp.storbinary(f"STOR {file_name}", fp)

def main():
    print("Connecting...")
    ftp = ftplib.FTP(FTP_HOST, timeout=60)
    ftp.login(FTP_USER, FTP_PASS)
    print("Connected.")

    # 1. Eliminar autoload_files.php en el servidor si existe
    try:
        ftp.cwd("/api/vendor/composer")
        ftp.delete("autoload_files.php")
        print("[OK] autoload_files.php eliminado del servidor.")
    except Exception as e:
        print(f"Nota: {e}")

    # 2. Subir autoload.php
    upload_file(ftp, os.path.join(BASE_VENDOR, "autoload.php"), "/api/vendor/autoload.php")

    # 3. Subir todos los archivos de composer/
    composer_dir = os.path.join(BASE_VENDOR, "composer")
    for f in os.listdir(composer_dir):
        p = os.path.join(composer_dir, f)
        if os.path.isfile(p):
            upload_file(ftp, p, f"/api/vendor/composer/{f}")

    ftp.quit()
    print("[EXITO] Autoloader limpio sincronizado al servidor.")

if __name__ == "__main__":
    main()
