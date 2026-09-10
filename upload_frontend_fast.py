import os
import ftplib

FTP_HOST = "ftp.dataholics.com.mx"
FTP_USER = "DEV-UW@alimpiarelmundo.dataholics.com.mx"
FTP_PASS = "itc=imD3B=LU"
LOCAL_DIST = r"C:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\proyectos\A Limpiar el Mundo\frontend\dist"

def ensure_dir(ftp, path):
    parts = path.strip("/").split("/")
    current = ""
    for part in parts:
        if not part:
            continue
        current += "/" + part
        try:
            ftp.cwd(current)
        except Exception:
            try:
                ftp.mkd(current)
                ftp.cwd(current)
            except Exception as e:
                pass

def main():
    print(f"Connecting to {FTP_HOST} as {FTP_USER}...")
    ftp = ftplib.FTP(FTP_HOST, timeout=60)
    ftp.login(FTP_USER, FTP_PASS)
    print("Connected successfully. Starting upload of frontend/dist...")

    total_files = 0
    uploaded_files = 0

    for root, dirs, files in os.walk(LOCAL_DIST):
        total_files += len(files)

    for root, dirs, files in os.walk(LOCAL_DIST):
        rel_dir = os.path.relpath(root, LOCAL_DIST).replace("\\", "/")
        target_dir = "/" if rel_dir == "." else f"/{rel_dir}"
        ensure_dir(ftp, target_dir)

        for f in files:
            local_file = os.path.join(root, f)
            remote_file = f if target_dir == "/" else f"{target_dir}/{f}"
            
            print(f"Uploading ({uploaded_files + 1}/{total_files}): {remote_file}...")
            with open(local_file, "rb") as fp:
                ftp.storbinary(f"STOR {f}", fp)
            uploaded_files += 1

    ftp.quit()
    print(f"\n[DONE] All {uploaded_files} frontend files uploaded successfully!")

if __name__ == "__main__":
    main()
