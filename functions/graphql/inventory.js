const Inventory = require("../database/inventory");
const {gql} = require("apollo-server-express");

// Create enum for usage_tag
// Define custom scalar for date
const typeDef = gql`
    type Inventory {
        item_id: Int!
        item_name: String!
        user_id: Int!
        expiry_id: Int!
        input_date: String
        expiry_date: String
        expiry_tag: Boolean
        usage_tag: String
    }

    input AddInventory {
        item_name: String!
        user_id: Int!
        expiry_id: Int!
        input_date: String
        expiry_date: String
        expiry_tag: Boolean
        usage_tag: String
    }
`;

const resolvers = {
  Query: {
    inventories: async (_, args) => {
      const inventories = await Inventory.getInventories();

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
  Mutation: {
    // Add input date calculation, expiry date calculation, default tags, expiry id retrieval
    // Validate user_id exists in user and item_name is not null
    addInventory: async (_, {inventory}) =>
      await Inventory.addInventory(inventory),
    // Validate user_id & item_id exists in inventory, usage_tag is enum, expiry_tag is boolean
    // editInventory: async (_, {inventory}) =>
    //  await Inventory.editInventory(inventory),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
