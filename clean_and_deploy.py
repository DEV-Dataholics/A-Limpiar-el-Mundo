import os
import ftplib

FTP_HOST = "ftp.dataholics.com.mx"
FTP_USER = "DEV-UW@alimpiarelmundo.dataholics.com.mx"
FTP_PASS = "itc=imD3B=LU"

BASE_DIR = r"C:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\proyectos\A Limpiar el Mundo"
LOCAL_DIST = os.path.join(BASE_DIR, "frontend", "dist")

BACKEND_FILES = [
    ("api/app/Config/Routes.php", "/api/app/Config/Routes.php"),
    ("api/app/Controllers/Admin/Corporates.php", "/api/app/Controllers/Admin/Corporates.php"),
    ("api/app/Controllers/Admin/Metrics.php", "/api/app/Controllers/Admin/Metrics.php"),
    ("api/app/Controllers/Admin/Users.php", "/api/app/Controllers/Admin/Users.php"),
    ("api/app/Controllers/CorporateController.php", "/api/app/Controllers/CorporateController.php"),
    ("api/app/Controllers/Registrations.php", "/api/app/Controllers/Registrations.php"),
]

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
    print(f"Connecting to {FTP_HOST} as {FTP_USER}...")
    ftp = ftplib.FTP(FTP_HOST, timeout=60)
    ftp.login(FTP_USER, FTP_PASS)
    print("Connected.")

    # 1. Limpieza de .jpg fuera de lugar en /api/app/Controllers
    print("\n--- Limpiando /api/app/Controllers ---")
    try:
        ftp.cwd("/api/app/Controllers")
        files_in_ctrl = ftp.nlst()
        for f in files_in_ctrl:
            if f.lower().endswith(".jpg") or f.lower().endswith(".png"):
                print(f"Eliminando archivo desubicado: {f}")
                ftp.delete(f)
    except Exception as e:
        print(f"Nota en limpieza: {e}")

    # 2. Subir Backend Controllers
    print("\n--- Subiendo Backend Controllers ---")
    for rel_local, remote_path in BACKEND_FILES:
        full_local = os.path.join(BASE_DIR, rel_local.replace("/", os.sep))
        upload_file(ftp, full_local, remote_path)
    print("[OK] Backend controllers actualizados con éxito.")

    # 3. Subir Frontend (Priorizando index.html y assets)
    print("\n--- Subiendo Frontend (assets e index.html primero) ---")
    # Subir assets
    assets_dir = os.path.join(LOCAL_DIST, "assets")
    if os.path.exists(assets_dir):
        for f in os.listdir(assets_dir):
            local_p = os.path.join(assets_dir, f)
            if os.path.isfile(local_p):
                upload_file(ftp, local_p, f"/assets/{f}")

    # Subir index.html
    upload_file(ftp, os.path.join(LOCAL_DIST, "index.html"), "/index.html")

    # Subir el resto de archivos en root de dist
    for f in os.listdir(LOCAL_DIST):
        local_p = os.path.join(LOCAL_DIST, f)
        if os.path.isfile(local_p) and f != "index.html":
            upload_file(ftp, local_p, f"/{f}")

    ftp.quit()
    print("\n[EXITO TOTAL] Todos los archivos de Backend y Frontend están en producción.")

if __name__ == "__main__":
    main()
