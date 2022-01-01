# Karrot Web

## Description
---
Karrot Web provisions a Firebase app, which consists of the following SDK features:
- Cloud Functions (back-end server)
- Firestore (NoSQL database)

Other features that have been enabled but are not currently used include:
- Pub/Sub
- Real-time database (stream)
- Authentication
- Hosting (web front-end)

All code related to Cloud Functions and Firestore can be found in the **functions** subdirectory.

Additionally, the app uses Apollo GraphQL as its API query language.

## Set Up
---
1. Clone repository and run `npm install` at the root level and within the functions subdirectory (make sure you have node 14.16.0 installed; check by running `node -v` in the terminal).
2. Go to the Firebase console and generate a new private key (Project Settings > Service Accounts > Select Node.js > Generate new private key). 
3. Download and save the service account credentials under a credentials folder under the functions subdirectory.
4. Copy the environment variables from .env.default to a .env file in the root folder and in the functions subdirectory.
5. Go to the Firebase console and locate the Firebase configurations (Project Settings > General). Copy all of the Firebase configurations into the .env file in the root folder.
6. Update the environment variable for FIREBASE_SERVICE_ACCOUNT in the .env file in the functions subdirectory to the path for your service account json file that was loaded to the credentials folder i.e. ../credentials/SERVICE_ACCOUNT_FILE_NAME.json.
7. Run `firebase emulators:start --import=./emulators.backup` to start all Firebase features while importing seed data into Firestore (if you do not import seed data, Firestore will be empty).
8. To export the emulator data for future use (should you add or change any collections or documents), run `firebase emulators:export ./emulators.backup` in a separate terminal while the emulator is still running. This will replace the existing emulator backup files.
9. To use GraphQL's playground while the emulator is running, head to [Apollo Studio](https://studio.apollographql.com/). Create a new graph and enter into your localhost graphql url (after you run start the emulator, the terminal will print out a graphql url i.e. http://localhost:5001/karrot-hq/us-central1/graphql).

## Deployment
---
1. Ensure there are secrets for FIREBASE_TOKEN and FIREBASE_SERVICE_ACCOUNT in the GitHub repository.
2. On root level, run `firebase deploy`. Priority is to ensure that functions and firestore are deployed successfully.
3. Once deployed, you can reference https://us-central1-karrot-hq.cloudfunctions.net/graphql for production build.