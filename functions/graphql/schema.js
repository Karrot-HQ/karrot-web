const {merge} = require("lodash");

// TypeDef Imports
const User = require("./user").typeDef;

// Resolver Imports
const UserResolvers = require("./user").resolvers;

const Query = `
    type Query {
        users(user_id: Int, email: String, first_name: String, last_name: String): [User]
    }
`;

let resolvers = {};

const typeDefs = [Query, User];
resolvers = merge(resolvers, UserResolvers);

module.exports = {
  typeDefs,
  resolvers,
};
