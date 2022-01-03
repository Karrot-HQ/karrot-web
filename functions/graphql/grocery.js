const Grocery = require("../database/grocery");
const {gql} = require("apollo-server-express");
const {TimestampResolver} = require("graphql-scalars");

// Remove expiry_id from groceries collection
// Add input_date to groceries collection
const typeDef = gql`
    type Grocery {
        item_id: Int!
        item_name: String!
        user_id: Int!
        input_date: Timestamp
        delete_tag: Boolean
        bought_tag: Boolean
    }

    input AddGrocery {
        item_name: String!
        user_id: Int!
        input_date: Timestamp
        delete_tag: Boolean
        bought_tag: Boolean
    }
`;

const resolvers = {
  Timestamp: TimestampResolver,
  Query: {
    groceries: async (_, args) => {
      const groceries = await Grocery.getGroceries();

      if (!args.user_id && !args.item_id) {
        return groceries;
      } else if (!args.item_id) {
        return groceries.filter((grocery) =>
          parseInt(grocery.user_id) === parseInt(args.user_id));
      } else {
        return groceries.filter((grocery) =>
          parseInt(grocery.user_id) === parseInt(args.user_id) &&
            parseInt(grocery.item_id) === parseInt(args.item_id));
      }
    },
  },
  Mutation: {
    // Add input date calculation, default tags
    // Validate user_id exists in user and item_name is not null
    addGrocery: async (_, {grocery}) =>
      await Grocery.addGrocery(grocery),
    // Validate user_id & item_id exists in grocery, delete_tag is boolean, bought_tag is boolean
    // editGrocery: async (_, {grocery}) =>
    //  await Grocery.editGrocery(grocery),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
