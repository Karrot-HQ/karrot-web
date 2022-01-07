const Inventory = require("../database/inventory");
const {gql} = require("apollo-server-express");

// Create enum for usage_tag


const typeDef = gql`
    enum UsageType {
      unused,
      used,
      tossed,
    }
    type Inventory {
        item_id: Int!
        item_name: String!
        user_id: Int!
        expiry_id: Int!
        input_date: String
        expiry_date: String
        expiry_tag: Boolean
        usage_tag: UsageType
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

    input EditInventoryTags {
      item_id: Int!
      user_id: Int!
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
    // Add expiry id retrieval
    addInventory: async (_, {inventory}) =>
      await Inventory.addInventory(inventory),
    editInventoryTags: async (_, {inventory}) =>
      await Inventory.editInventoryTags(inventory),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
