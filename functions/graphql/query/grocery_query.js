const {gql} = require("apollo-server-express");
const {DateTimeResolver} = require("graphql-scalars");

const Grocery = require("../../database/collections/grocery_collection");

// Set fields
const typeDef = gql`
    type Grocery {
        item_id: Int!
        item_name: String!
        user_id: Int!
        input_date: DateTime
        delete_tag: Boolean
        bought_tag: Boolean
        last_updated: DateTime
    }
`;

const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    groceries: async (_, args) => {
      const groceries = await Grocery.getGroceries();
      groceries.forEach((grocery) => {
        grocery.last_updated = grocery.last_updated.toDate();
        grocery.input_date = grocery.input_date.toDate();
      });

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
};

module.exports = {
  typeDef,
  resolvers,
};
