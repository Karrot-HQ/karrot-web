const {gql} = require("apollo-server-express");
const {DateTimeResolver} = require("graphql-scalars");

const Grocery = require("../../database/collections/grocery_collection");

// Set fields
const typeDef = gql`
    input AddGrocery {
        item_name: String!
        user_id: Int! @constraint(min: 1)
        delete_tag: Boolean
        bought_tag: Boolean
    }

    input EditGrocery {
        item_id: Int! @constraint(min: 1)
        user_id: Int! @constraint(min: 1)
        delete_tag: Boolean
        bought_tag: Boolean
    }
`;

const resolvers = {
  DateTime: DateTimeResolver,
  Mutation: {
    addGrocery: async (_, {grocery}) =>
      await Grocery.addGrocery(grocery),
    editGrocery: async (_, {grocery}) =>
      await Grocery.editGrocery(grocery),
  },
};

module.exports = {
  typeDef,
  resolvers,
};
