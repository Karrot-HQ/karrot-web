const User = require("../database/user");
const {gql} = require("apollo-server-express");

const typeDef = gql`
    type User {
      user_id: Int!
      email: String!
      first_name: String
      last_name: String
    }

    input AddUser {
      email: String!
      first_name: String
      last_name: String
    }
`;

const resolvers = {
  Query: {
    users: async (_, args) => {
      const users = await User.getUsers();

      // Filter reuslts based on user_id and/or email
      if (!args.user_id && !args.email) {
        return users;
      } else if (!args.user_id) {
        return users.filter((user) => parseInt(user.email) === parseInt(args.email));
      } else if (!args.email) {
        return users.filter((user) => parseInt(user.user_id) === parseInt(args.user_id));
      }
    },
  },
  Mutation: {
    addUser: async (_, {user}) =>
      await User.addUser(user),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
