const {gql} = require("apollo-server-express");
const {DateTimeResolver} = require("graphql-scalars");

const User = require("../../database/collections/user_collection");

const typeDef = gql`
    type User {
      user_id: Int!
      email: String!
      first_name: String
      last_name: String
      input_date: DateTime
      last_updated: DateTime
    }
`;

const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    users: async (_, args) => {
      const users = await User.getUsers();
      users.forEach((user) => {
        user.last_updated = user.last_updated.toDate();
        user.input_date = user.input_date.toDate();
      });

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
};

module.exports = {
  typeDef,
  resolvers,
};
