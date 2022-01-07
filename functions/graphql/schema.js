const {merge} = require("lodash");
const {gql} = require("apollo-server-express");

// TypeDef Imports
const User = require("./user").typeDef;
const Grocery = require("./grocery").typeDef;
const Inventory = require("./inventory").typeDef;

// Resolver Imports
const UserResolvers = require("./user").resolvers;
const GroceryResolvers = require("./grocery").resolvers;
const InventoryResolvers = require("./inventory").resolvers;

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

const typeDefs = [Query, Mutation, User, Grocery, Inventory];
let resolvers = {};
resolvers = merge(resolvers, UserResolvers, GroceryResolvers, InventoryResolvers);

module.exports = {
  typeDefs,
  resolvers,
};
