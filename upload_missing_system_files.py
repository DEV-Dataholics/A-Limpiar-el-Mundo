import os
import ftplib

FTP_HOST = "ftp.dataholics.com.mx"
FTP_USER = "DEV-UW@alimpiarelmundo.dataholics.com.mx"
FTP_PASS = "itc=imD3B=LU"

BASE_SYSTEM = r"C:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\proyectos\A Limpiar el Mundo\api\vendor\codeigniter4\framework\system"
MISSING_DIRS = ["Traits", "Validation", "Typography", "Throttle", "View"]

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

    for d in MISSING_DIRS:
        local_dir = os.path.join(BASE_SYSTEM, d)
        for root, dirs, files in os.walk(local_dir):
            rel_dir = os.path.relpath(root, BASE_SYSTEM).replace("\\", "/")
            remote_target_dir = f"/api/vendor/codeigniter4/framework/system/{rel_dir}"
            for f in files:
                local_f = os.path.join(root, f)
                remote_f = f"{remote_target_dir}/{f}"
                upload_file(ftp, local_f, remote_f)

    ftp.quit()
    print("[EXITO] Todos los modulos faltantes de CodeIgniter fueron desplegados.")

if __name__ == "__main__":
    main()
