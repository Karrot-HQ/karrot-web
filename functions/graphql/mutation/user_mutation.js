const {gql} = require("apollo-server-express");
const {DateTimeResolver} = require("graphql-scalars");

const User = require("../../database/collections/user_collection");

const typeDef = gql`
    input AddUser {
      email: String! @constraint(minLength: 5, format: "email")
      first_name: String
      last_name: String
    }
`;

const resolvers = {
  DateTime: DateTimeResolver,
  Mutation: {
    addUser: async (_, {user}) =>
      await User.addUser(user),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
