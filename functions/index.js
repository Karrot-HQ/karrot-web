const functions = require("firebase-functions");
const express = require("express");
const {ApolloServer} = require("apollo-server-express");

const {typeDefs, resolvers} = require("./graphql/schema");

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({app, path: "/", cors: true});

exports.graphql = functions.https.onRequest(app);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
