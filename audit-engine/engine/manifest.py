import csv
import hashlib
import zipfile


def generate_manifest(zip_path):
    out_path = 'METADATA_MANIFEST.csv'
    with open(out_path, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['filename', 'relative_path', 'size_bytes', 'sha256_hash'])

        with zipfile.ZipFile(zip_path, 'r') as z:
            for info in z.infolist():
                with z.open(info.filename) as f:
                    hash_sha256 = hashlib.sha256(f.read()).hexdigest()
                writer.writerow([info.filename, info.filename, info.file_size, hash_sha256])

    return out_path
