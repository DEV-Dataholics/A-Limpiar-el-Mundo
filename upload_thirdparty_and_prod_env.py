import os
import ftplib

FTP_HOST = "ftp.dataholics.com.mx"
FTP_USER = "DEV-UW@alimpiarelmundo.dataholics.com.mx"
FTP_PASS = "itc=imD3B=LU"

BASE_DIR = r"C:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\proyectos\A Limpiar el Mundo"
LOCAL_THIRDPARTY = os.path.join(BASE_DIR, "api", "vendor", "codeigniter4", "framework", "system", "ThirdParty")

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

    # 1. Subir ThirdParty/
    for root, dirs, files in os.walk(LOCAL_THIRDPARTY):
        rel = os.path.relpath(root, LOCAL_THIRDPARTY).replace("\\", "/")
        remote_target = "/api/vendor/codeigniter4/framework/system/ThirdParty" if rel == "." else f"/api/vendor/codeigniter4/framework/system/ThirdParty/{rel}"
        for f in files:
            lp = os.path.join(root, f)
            rp = f"{remote_target}/{f}"
            upload_file(ftp, lp, rp)

    ftp.quit()
    print("[EXITO] ThirdParty subido al servidor.")

if __name__ == "__main__":
    main()
