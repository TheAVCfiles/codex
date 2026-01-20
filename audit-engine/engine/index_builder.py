import csv
import os
from datetime import datetime


def generate_index(new_files):
    out_path = 'FINDINGS_INDEX.csv'
    with open(out_path, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['date_collected', 'source_type', 'source_url', 'artifact_id', 'notes'])

        for file in new_files:
            writer.writerow([
                datetime.now().strftime('%Y-%m-%d'),
                os.path.splitext(file)[1][1:].upper(),
                '',
                os.path.basename(file),
                '',
            ])

    return out_path
