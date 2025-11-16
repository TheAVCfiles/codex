# Go-Live Manual Steps Status

The repository cannot complete the final deployment sequence automatically because it requires manual access to external services.

## Pending Human Actions

1. Create and publish the intake form on Tally.so with the required questions.
2. Insert the published Tally form URL into `decrypt-the-future-services.html` (line 101) in place of `YOUR_INTAKE_FORM_URL`.
3. Deploy the updated page using the Firebase CLI (`firebase deploy --only hosting`).

These actions involve credentials and production deployment targets that are not available within the automated environment, so they remain outstanding for a human operator.
