const db = require("./firestore");
const validator = require("../utility_functions/validator.js");
const util = require("../utility_functions/utility.js");

// Query: Get all data from groceries collection
const getGroceries = async () => (await db.collection("groceries").get())
    .docs.map((grocery) => grocery.data());

// Mutation: Add a grocery item
// Required: user_id (int), item_name (string)
// Optional: delete_tag (boolean), bought_tag (boolean)
const addGrocery = async (groceryData) => {
  const userId = groceryData.user_id;
  const itemName = groceryData.item_name;
  const deleteTag = groceryData.delete_tag ? groceryData.delete_tag : false;
  const boughtTag = groceryData.bought_tag ? groceryData.bought_tag : false;
  const inputDate = new Date; // firebase.firestore.Timestamp.now();

  // Validate that user_id and item_name are in correct formats
  const validateUserId = validator.validateInt(userId);
  const validateItemName = validator.validateAlphaNumeric(itemName);

  // Check that user_id exists in users collection
  let checkUserId = false;
  if (validateUserId && validateItemName) {
    checkUserId = await util.userIdCheck(userId);
  }

  if (checkUserId) {
    // Get latest item_id for the user
    const latestSnapshot =
      await db.collection("groceries").where("user_id", "==", userId)
          .orderBy("item_id", "desc").limit(1).get();

    // Increment by 1 to get new item_id or start at 1
    let newItemId = 1;
    if (latestSnapshot.docs.length > 0) {
      newItemId = latestSnapshot.docs[0].data().item_id += 1;
    }
    const newDocId = userId.toString() + "." + newItemId.toString();

    await db.collection("groceries").doc(String(newDocId)).set({
      item_id: newItemId,
      user_id: userId,
      item_name: itemName,
      delete_tag: deleteTag,
      bought_tag: boughtTag,
      input_date: inputDate,
    });
    return true;
  }
  return false;
};

// Mutation: Edit bought_tag and/or delete_tag
// Required: user_id (int), item_id (int), one of 1) bought_tag (boolean), 2) delete_tag (boolean)
const editGroceryTags = async (groceryData) => {
  const docId = groceryData.user_id.toString() + "." + groceryData.item_id.toString();
  let res = false;
  let validateBoughtTag = true;
  let validateDeleteTag = true;
  // Check that user_id and item_id combination exists
  const checkIds = await util.groceryIdCheck(groceryData.user_id, groceryData.item_id);

  // Check that tags are in correct format
  if (groceryData.bought_tag !== undefined) {
    validateBoughtTag = validator.validateBoolean(groceryData.bought_tag);
  }
  if (groceryData.delete_tag !== undefined) {
    validateDeleteTag = validator.validateBoolean(groceryData.delete_tag);
  }

  if (checkIds && validateBoughtTag && validateDeleteTag) {
    if (groceryData.bought_tag !== undefined && groceryData.delete_tag !== undefined) {
      await db.collection("groceries").doc(String(docId)).update({
        bought_tag: groceryData.bought_tag,
        delete_tag: groceryData.delete_tag,
      });
      res = true;
    } else if (groceryData.bought_tag !== undefined) {
      await db.collection("groceries").doc(String(docId)).update({
        bought_tag: groceryData.bought_tag,
      });
      res = true;
    } else if (groceryData.delete_tag !== undefined) {
      await db.collection("groceries").doc(String(docId)).update({
        delete_tag: groceryData.delete_tag,
      });
      res = true;
    }
  }
  return res;
};

module.exports = {
  getGroceries,
  addGrocery,
  editGroceryTags,
};
