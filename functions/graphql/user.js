const User = require("../database/user");

const typeDef = `
    type User {
        user_id: Int
        email: String
        first_name: String
        last_name: String
    }
`;

const resolvers = {
  Query: {
    users: async (_, args) => {
      const users = await User.getUsers();

      if (!args.user_id) {
        return users;
      }
      return users.filter((user) =>
        parseInt(user.user_id) === parseInt(args.user_id));
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
