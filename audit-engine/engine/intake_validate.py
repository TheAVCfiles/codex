import os
import re
import sys


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_TOTAL_SIZE = 20 * 1024 * 1024  # 20MB
ALLOWED_EXTENSIONS = {'.png', '.jpg', '.pdf'}
FILENAME_PATTERN = re.compile(r'^[A-Za-z0-9._-]+$')


def is_encrypted_pdf(file_path):
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
        return b'/Encrypt' in content
    except OSError:
        return True


def validate_inbox():
    errors = []
    root_dir = os.path.dirname(os.path.dirname(__file__))
    inbox_path = os.path.join(root_dir, 'inbox')
    current_total = 0

    for root, _, files in os.walk(inbox_path):
        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, inbox_path)
            path_parts = rel_path.split(os.sep)

            if '..' in path_parts:
                errors.append(f"REJECTED: {rel_path} - Path traversal detected.")
                continue

            if len(path_parts) > 2:
                errors.append(
                    f"REJECTED: {rel_path} - Folder nesting exceeds one level."
                )

            if not FILENAME_PATTERN.match(file):
                errors.append(
                    f"REJECTED: {rel_path} - Filename contains illegal characters."
                )

            ext = os.path.splitext(file)[1].lower()
            if ext not in ALLOWED_EXTENSIONS:
                errors.append(f"REJECTED: {rel_path} - Invalid file type.")

            try:
                size = os.path.getsize(file_path)
            except OSError:
                errors.append(f"REJECTED: {rel_path} - File is not readable.")
                continue

            if size > MAX_FILE_SIZE:
                errors.append(f"REJECTED: {rel_path} - File exceeds 10MB limit.")

            current_total += size

            if ext == '.pdf' and is_encrypted_pdf(file_path):
                errors.append(f"REJECTED: {rel_path} - PDF appears encrypted.")

    if current_total > MAX_TOTAL_SIZE:
        errors.append(
            f"REJECTED: Batch size {current_total} exceeds 20MB limit."
        )

    if errors:
        report_path = os.path.join(root_dir, 'REJECTION_REPORT.md')
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("# Intake Failure\n")
            f.write("\n".join(errors))
        sys.exit(1)


if __name__ == '__main__':
    validate_inbox()
