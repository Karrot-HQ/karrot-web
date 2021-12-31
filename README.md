## Karrot Web

### Description
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

### Set Up
1. Clone repository and run `npm install` at the root level and within the functions subdirectory (make sure you have node 14.16.0 installed).
2. Go to the Firebase console and generate a new private key (Project Settings > Service Accounts > Select Node.js > Generate new private key). 
3. Download and save the service account credentials under a credentials folder under the functions subdirectory.
4. Go to the firestore.js file under the database folder under the functions subdirectory and update the path to your service account credentials file.
5. Copy the environment variables from .env.default to a .env file.
6. Go to the Firebase console and locate the Firebase configurations (Project Settings > General). Copy all the Firebase Configurations into the .env file.
7. Run `firebase emulators:start --import=./emulators.backup` to start all Firebase features while importing seed data into Firestore (if you do not import seed data, Firestore will be empty).
8. To export the emulator data for future use, run `firebase emulators:export ./emulators.backup` in a separate terminal while the emulator is still running. This will replace the existing emulator backup file.
