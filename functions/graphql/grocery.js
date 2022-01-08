const Grocery = require("../database/grocery");
const {gql} = require("apollo-server-express");
const {TimestampResolver} = require("graphql-scalars");

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

    input EditGroceryTags {
        item_id: Int!
        user_id: Int!
        delete_tag: Boolean
        bought_tag: Boolean
    }
`;

const resolvers = {
  Timestamp: TimestampResolver,
  Query: {
    groceries: async (_, args) => {
      const groceries = await Grocery.getGroceries();

      // Filter results based on user_id and/or item_id
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
    addGrocery: async (_, {grocery}) =>
      await Grocery.addGrocery(grocery),
    editGroceryTags: async (_, {grocery}) =>
      await Grocery.editGroceryTags(grocery),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
