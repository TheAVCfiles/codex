# 24-Hour Gemini Credit Sprint Playbook

This guide captures the emergency workflow for exhausting the $2,199.59 in Gemini Code Assist credits that expire within the next day. Follow the sequence to authenticate, launch the high-throughput content factory from an iPad, and maintain verifiable backups of every generated asset.

## 1. Prepare the Environment

1. Confirm that billing for project `coherent-span-464519-i9` is attached to billing account `01FC35-7E241C-B198F4`.
2. Enable the required Google Cloud services:
   ```bash
   gcloud config set project coherent-span-464519-i9
   gcloud services enable aiplatform.googleapis.com
   gcloud services enable storage.googleapis.com
   gcloud services enable compute.googleapis.com
   ```
3. Ensure a Cloud Storage bucket exists for fail-safe exports, for example:
   ```bash
   gsutil mb -p coherent-span-464519-i9 -l us-central1 gs://coherent-span-464519-i9-emergency-backup
   ```

## 2. Authenticate with Application Default Credentials

Run the following once from the iPad terminal (Terminus or Prompt 3) to authorize Vertex AI access in non-interactive scripts:

```bash
gcloud auth application-default login
```

If you are using a federated identity, sign in with `gcloud auth login` first and then repeat the `application-default` login.

## 3. Provision the Emergency Sprint VM

Spin up a GPU-enabled workstation that will run the content factory for the entire 24-hour window:

```bash
gcloud compute instances create emergency-content-sprint \
  --project=coherent-span-464519-i9 \
  --zone=us-central1-a \
  --machine-type=n1-standard-16 \
  --accelerator=type=nvidia-tesla-v100,count=1 \
  --image-family=pytorch-latest-gpu \
  --image-project=deeplearning-platform-release \
  --boot-disk-size=500GB \
  --boot-disk-type=pd-ssd \
  --preemptible
```

Authorize iPad SSH access by adding the public key to the instance metadata, then connect:

```bash
ssh USERNAME@EXTERNAL_IP
```

## 4. Deploy the Emergency Content Factory

1. Copy `emergency_sprint.py` (the parallel Gemini generator) to the VM.
2. Export the Gemini API key in the session (`export GEMINI_API_KEY=...`).
3. Launch the sprint in the background so it survives SSH disconnects:
   ```bash
   nohup python3 emergency_sprint.py > emergency.log 2>&1 &
   tail -f emergency.log
   ```
4. The script batches requests (≈$1.50 per curriculum) until the spend reaches $2,180, leaving a $20 buffer before expiration.

## 5. Maintain Continuous Backups

The script persists checkpoints to Cloud Storage after every batch, but you should also run the following helper to mirror assets to the iPad every two hours:

```bash
while true; do
  sleep 7200
  gsutil -m cp gs://coherent-span-464519-i9-emergency-backup/*.json ./ipad-downloads/
  date
  ls -lh ./ipad-downloads | tail -5
done
```

This guarantees three copies: the running VM, Cloud Storage, and the iPad filesystem.

## 6. Monitor Credit Consumption and Shut Down Safely

- Watch progress from the iPad with `grep "Generated" emergency.log | tail -5`.
- When the log reports spend beyond $2,150, issue `pkill -f emergency_sprint.py` so the buffer remains.
- Archive the final dataset:
  ```bash
  tar -czf embodied-learning-sprint.tar.gz *.json
  gsutil cp embodied-learning-sprint.tar.gz gs://coherent-span-464519-i9-emergency-backup
  ```
- Stop the instance to prevent further credit usage:
  ```bash
  gcloud compute instances stop emergency-content-sprint --zone=us-central1-a
  ```

Following these steps converts the expiring credits into an offline-ready library of embodied-learning curricula, corporate training modules, and licensing collateral without risking loss from preemption or billing overruns.
