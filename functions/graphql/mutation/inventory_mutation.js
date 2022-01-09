const {gql} = require("apollo-server-express");
const {DateTimeResolver} = require("graphql-scalars");

const Inventory = require("../../database/collections/inventory_collection");

const typeDef = gql`
    input AddInventory {
        item_name: String!
        user_id: Int! @constraint(min: 1)
        grocery_id: Int @constraint(min: 1)
        expiry_tag: Boolean
        usage_tag: UsageType
        delete_tag: Boolean
    }

    input EditInventory {
      item_id: Int! @constraint(min: 1)
      user_id: Int! @constraint(min: 1)
      expiry_tag: Boolean
      usage_tag: UsageType
      delete_tag: Boolean
  }
`;

const resolvers = {
  DateTime: DateTimeResolver,
  Mutation: {
    addInventory: async (_, {inventory}) =>
      await Inventory.addInventory(inventory),
    editInventory: async (_, {inventory}) =>
      await Inventory.editInventory(inventory),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
