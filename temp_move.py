import os
import shutil

# Move critical backend files to root for Railway detection
root_dir = r"d:\arabic root"
backend_dir = r"d:\arabic root\backend"

files_to_move = ["main.py", "requirements.txt", "Procfile", "start.sh"]

for f in files_to_move:
    src = os.path.join(backend_dir, f)
    dst = os.path.join(root_dir, f)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Moved {f} to root")
