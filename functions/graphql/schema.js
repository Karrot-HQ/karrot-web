const {gql} = require("apollo-server-express");

// TypeDef imports
const UserQueryTypeDefs = require("./query/user_query").typeDef;
const UserMutationTypeDefs = require("./mutation/user_mutation").typeDef;
const GroceryQueryTypeDefs = require("./query/grocery_query").typeDef;
const GroceryMutationTypeDefs = require("./mutation/grocery_mutation").typeDef;
const InventoryQueryTypeDefs = require("./query/inventory_query").typeDef;
const InventoryMutationTypeDefs = require("./mutation/inventory_mutation").typeDef;
const RecipeQueryTypeDefs = require("./query/recipe_query").typeDef;

// Resolver imports
const UserQueryResolvers = require("./query/user_query").resolvers;
const UserMutationResolvers = require("./mutation/user_mutation").resolvers;
const GroceryQueryResolvers = require("./query/grocery_query").resolvers;
const GroceryMutationResolvers = require("./mutation/grocery_mutation").resolvers;
const InventoryQueryResolvers = require("./query/inventory_query").resolvers;
const InventoryMutationResolvers = require("./mutation/inventory_mutation").resolvers;
const RecipeQueryResolvers = require("./query/recipe_query").resolvers;

// Set arguments
// To do: fix datetime arguments
const Query = gql`
    enum UsageType {
      unused,
      used,
      tossed,
    }

    type Query {
        users(
          user_id: Int, 
          email: String, 
          first_name: String, 
          last_name: String,
          input_date: DateTime,
          last_updated: DateTime
        ): [User]

        groceries(
          item_id: Int, 
          item_name: String, 
          user_id: Int,  
          input_date: DateTime,
          delete_tag: Boolean, 
          bought_tag: Boolean,
          last_updated: DateTime
        ): [Grocery]

        inventories(
          item_id: Int, 
          item_name: String, 
          user_id: Int, 
          expiry_id: Int, 
          input_date: DateTime, 
          expiry_date: DateTime,
          expiry_tag: Boolean, 
          usage_tag: String,
          last_updated: DateTime
        ): [Inventory]

        recipes(
          ingredients: String,
          number: Int,
          limitLicense: Boolean,
          ranking: Int,
          ignorePantry: Boolean
        ): [Recipe]

        recipesInfo(
          ids: String,
          includeNutrition: Boolean
        ): [RecipeInfo]
    }
`;

const Mutation = gql`
    type Mutation {
      addUser(user: AddUser): Boolean
      addGrocery(grocery: AddGrocery): Boolean
      editGrocery(grocery: EditGrocery): Boolean
      addInventory(inventory: AddInventory): Boolean
      editInventory(inventory: EditInventory): Boolean
    }
`;

const typeDefs = [
  Query, Mutation, UserQueryTypeDefs, UserMutationTypeDefs, GroceryQueryTypeDefs,
  GroceryMutationTypeDefs, InventoryQueryTypeDefs, InventoryMutationTypeDefs,
  RecipeQueryTypeDefs,
];
const resolvers = [
  UserQueryResolvers, UserMutationResolvers, GroceryQueryResolvers,
  GroceryMutationResolvers, InventoryQueryResolvers, InventoryMutationResolvers,
  RecipeQueryResolvers,
];

module.exports = {
  typeDefs,
  resolvers,
};
