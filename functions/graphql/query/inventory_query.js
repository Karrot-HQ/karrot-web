const {gql} = require("apollo-server-express");
const {DateTimeResolver} = require("graphql-scalars");

const Inventory = require("../../database/collections/inventory_collection");

const typeDef = gql`
    type Inventory {
        item_id: Int!
        item_name: String!
        user_id: Int!
        grocery_id: Int
        expiry_id: Int!
        input_date: DateTime
        expiry_date: DateTime
        expiry_tag: Boolean
        usage_tag: UsageType
        delete_tag: Boolean
        last_updated: DateTime
    }
`;

const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    inventories: async (_, args) => {
      const inventories = await Inventory.getInventories();
      console.log(inventories);
      inventories.forEach((inventory) => {
        inventory.last_updated = inventory.last_updated.toDate();
        inventory.input_date = inventory.input_date.toDate();
        inventory.expiry_date = inventory.expiry_date.toDate();
      });

      // Filter reuslts based on user_id and/or item_id
      if (!args.user_id && !args.item_id) {
        return inventories;
      } else if (!args.item_id) {
        return inventories.filter((inventory) =>
          parseInt(inventory.user_id) === parseInt(args.user_id));
      } else {
        return inventories.filter((inventory) =>
          parseInt(inventory.user_id) === parseInt(args.user_id) &&
          parseInt(inventory.item_id) === parseInt(args.item_id));
      }
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
