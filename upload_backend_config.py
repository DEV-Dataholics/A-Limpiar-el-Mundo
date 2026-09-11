import os
import ftplib

FTP_HOST = "ftp.dataholics.com.mx"
FTP_USER = "DEV-UW@alimpiarelmundo.dataholics.com.mx"
FTP_PASS = "itc=imD3B=LU"

BASE_DIR = r"C:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\proyectos\A Limpiar el Mundo"

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
    print("Connecting to FTP...")
    ftp = ftplib.FTP(FTP_HOST, timeout=60)
    ftp.login(FTP_USER, FTP_PASS)
    print("Connected.")

    # 1. Subir api/.env
    local_env = os.path.join(BASE_DIR, "api", ".env")
    if os.path.exists(local_env):
        print("Subiendo api/.env ...")
        upload_file(ftp, local_env, "/api/.env")

    # 2. Crear y subir api/writable y sus subcarpetas
    local_writable = os.path.join(BASE_DIR, "api", "writable")
    for root, dirs, files in os.walk(local_writable):
        rel_dir = os.path.relpath(root, local_writable).replace("\\", "/")
        target_dir = "/api/writable" if rel_dir == "." else f"/api/writable/{rel_dir}"
        navigate_to(ftp, target_dir)
        for f in files:
            local_p = os.path.join(root, f)
            upload_file(ftp, local_p, f"{target_dir}/{f}")

    # Asegurar que existan subdirectorios vacios
    for sub in ["cache", "debugbar", "logs", "session", "uploads"]:
        navigate_to(ftp, f"/api/writable/{sub}")

    ftp.quit()
    print("[OK] api/.env y api/writable configurados correctamente.")

if __name__ == "__main__":
    main()
