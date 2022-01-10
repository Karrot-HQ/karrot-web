# Karrot Web

## Summary

Karrot Web provisions a Firebase app, which consists of the following SDK features:
- Cloud Functions (back-end server)
- Firestore (NoSQL database)

Other features that have been enabled but are not currently used include:
- Pub/Sub
- Real-time database (stream)
- Authentication
- Hosting (web front-end)

All code related to Cloud Functions and Firestore can be found in the **functions** subdirectory.

## Technologies

- Firebase (Firestore, Cloud Functions)
- Node, Express
- Apollo GraphQL
- GitHub Actions
- ESLint

## Set Up

1. Clone repository and run `npm install` at the root level and within the functions subdirectory (make sure you have node 14.16.0 installed; check by running `node -v` in the terminal).
2. Go to the Firebase console and generate a new private key (Project Settings > Service Accounts > Select Node.js > Generate new private key). 
3. Download and save the service account credentials under a credentials folder under the functions subdirectory.
4. Convert the service account credentials to base64 by running `openssl base64 -in <service_account_file>.json -out <service_account_file>.txt -A`. Replace <service_account_file> with the name of the downloaded credentials file.
5. Copy the environment variables from .env.default to a .env file in the root folder and in the functions subdirectory.
6. Go to the Firebase console and locate the Firebase configurations (Project Settings > General). Copy all of the Firebase configurations into the .env file in the root folder.
7. Update the environment variable for FIREBASE_SERVICE_ACCOUNT_CONVERTED in the .env file in the functions subdirectory with the base64 version of the service account credentials.

## Export Data

1. To update the ./emulators.backup files based on production data, run `cd functions`, `unset FIRESTORE_EMULATOR_HOST`, then `firestore-export --accountCredentials serviceAccountFile.json --backupFile output.json`. Make sure to replace serviceAccountFile.json with the path to your service account credentials file. 
2. Afterwards, run `firebase emulators:start --only firestore`. This will start only the firestore feature. Then we want to ensure we write to the emulators by running `export FIRESTORE_EMULATOR_HOST=0.0.0.0:8080` or `export FIRESTORE_EMULATOR_HOST=localhost:8080` in a separate terminal. Replace 8080 with the port you are using for firestore that is set in the firebase.json file.
3. Run `firestore-import --accountCredentials serviceAccountFile.json --backupFile output.json` to import data in the firestore emulator via a separate terminal.

## Emulators

1. Run `firebase emulators:start --import=./emulators.backup` to start all Firebase features while importing seed data into Firestore (if you do not import seed data, Firestore will be empty).
2. To export the emulator data for future use (should you add or change any collections or documents), run `firebase emulators:export ./emulators.backup` in a separate terminal while the emulator is still running. This will replace the existing emulator backup files.
3. To use GraphQL's playground while the emulator is running, head to [Apollo Studio](https://studio.apollographql.com/). Create a new graph and enter in your localhost graphql url (after you run start the emulator, the terminal will print out a graphql url i.e. http://localhost:5001/karrot-hq/us-central1/graphql).

## Deployment

1. Ensure there are secrets for FIREBASE_TOKEN and FIREBASE_SERVICE_ACCOUNT_CONVERTED in the GitHub repository under the Production environment.
2. On root level, run `firebase deploy`. Priority is to ensure that functions and firestore are deployed successfully.
3. Once deployed, you can reference https://us-central1-karrot-hq.cloudfunctions.net/graphql for production build.

## CI/CD

1. Push changes to main to trigger 1) lint.yml and 2) firebase-functions-merge.yml in that order.
2. If there are eslint errors, firebase-functions-merge will not run.
