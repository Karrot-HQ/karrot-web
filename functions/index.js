const functions = require("firebase-functions");
const express = require("express");
const {ApolloServer} = require("apollo-server-express");
const {ApolloServerPluginLandingPageGraphQLPlayground} = require("apollo-server-core");

const {typeDefs, resolvers} = require("./graphql/schema");

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    // eslint-disable-next-line new-cap
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

server.applyMiddleware({app, path: "/", cors: true});

exports.graphql = functions.https.onRequest(app);
