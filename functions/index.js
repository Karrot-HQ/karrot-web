const functions = require("firebase-functions");
const express = require("express");
const {ApolloServer, makeExecutableSchema} = require("apollo-server-express");
const {ApolloServerPluginLandingPageGraphQLPlayground} = require("apollo-server-core");
const {DateTimeTypeDefinition, DateTimeResolver} = require("graphql-scalars");
const {constraintDirective, constraintDirectiveTypeDefs} = require("graphql-constraint-directive");

const {typeDefs, resolvers} = require("./graphql/schema");

let schema = makeExecutableSchema({
  typeDefs: [
    DateTimeTypeDefinition,
    constraintDirectiveTypeDefs,
    ...typeDefs,
  ],
  resolvers: [
    {DateTime: DateTimeResolver},
    ...resolvers,
  ],
  plugins: [
    // eslint-disable-next-line new-cap
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

schema = constraintDirective()(schema);
const app = express();
const server = new ApolloServer({schema});
server.applyMiddleware({app, path: "/", cors: true});

exports.graphql = functions.https.onRequest(app);
