const db = require("../firestore");
const util = require("../../utility_functions/utility.js");

// Query: Get all data from groceries collection
const getGroceries = async () => (await db.collection("groceries").get())
    .docs.map((grocery) => grocery.data());

// Mutation: Add a grocery item
// Required: user_id (int), item_name (string)
const addGrocery = async (groceryData) => {
  const userId = groceryData.user_id;
  const itemName = groceryData.item_name;
  const deleteTag = groceryData.delete_tag ? groceryData.delete_tag : false;
  const boughtTag = groceryData.bought_tag ? groceryData.bought_tag : false;
  const inputDate = new Date; // firebase.firestore.Timestamp.now();
  const lastUpdated = inputDate;

  // Check that user_id exists in users collection
  const checkUserId = await util.userIdCheck(userId);

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
      last_updated: lastUpdated,
    });
    return true;
  }
  return false;
};

// Mutation: Edit fields for a single item
// Required: user_id (int), item_id (int)
// To do: auto trigger add inventory if bought_tag is true
const editGrocery = async (groceryData) => {
  let res = false;
  // Check that user_id and item_id combination exists
  const checkIds = await util.groceryIdCheck(groceryData.user_id, groceryData.item_id);

  if (checkIds) {
    const docId = groceryData.user_id.toString() + "." + groceryData.item_id.toString();
    const lastUpdated = new Date();
    await db.collection("groceries").doc(String(docId)).update({
      last_updated: lastUpdated,
      ...groceryData,
    });
    res = true;
  }

  return res;
};

module.exports = {
  getGroceries,
  addGrocery,
  editGrocery,
};
