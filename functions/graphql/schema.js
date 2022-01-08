const {merge} = require("lodash");
const {gql} = require("apollo-server-express");

// TypeDef Imports
const User = require("./user").typeDef;
const Grocery = require("./grocery").typeDef;
const Inventory = require("./inventory").typeDef;
const Recipe = require("./recipe").typeDef;

// Resolver Imports
const UserResolvers = require("./user").resolvers;
const GroceryResolvers = require("./grocery").resolvers;
const InventoryResolvers = require("./inventory").resolvers;
const RecipeResolvers = require("./recipe").resolvers;

const Query = gql`
    type Query {
        users(
          user_id: Int, 
          email: String, 
          first_name: String, 
          last_name: String
        ): [User]

        groceries(
          item_id: Int, 
          item_name: String, 
          user_id: Int,  
          input_date: Timestamp,
          delete_tag: Boolean, 
          bought_tag: Boolean
        ): [Grocery]

        inventories(
          item_id: Int, 
          item_name: String, 
          user_id: Int, 
          expiry_id: Int, 
          input_date: String, 
          expiry_date: String,
          expiry_tag: Boolean, 
          usage_tag: String
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
      """
      Create a new user. Return true on success.
      """
      addUser(user: AddUser): Boolean
      addGrocery(grocery: AddGrocery): Boolean
      editGroceryTags(grocery: EditGroceryTags): Boolean
      addInventory(inventory: AddInventory): Boolean
      editInventoryTags(inventory: EditInventoryTags): Boolean
    }
`;

const typeDefs = [Query, Mutation, User, Grocery, Inventory, Recipe];
let resolvers = {};
resolvers = merge(resolvers, UserResolvers, GroceryResolvers, InventoryResolvers, RecipeResolvers);

module.exports = {
  typeDefs,
  resolvers,
};
