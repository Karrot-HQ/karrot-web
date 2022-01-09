const db = require("../firestore");
const util = require("../../utility_functions/utility.js");

const expiryCheck = async () => {
  const currentDate = new Date();
  const expiredItems = (await db.collection("inventories").where("expiry_tag", "==", false)
      .where("expiry_date", "<=", currentDate).get()).docs.map((items) => items.data());
  // const list = expiredItems.docs.map((items) => items.data());
  // console.log(list);
  expiredItems.forEach(async (doc) => {
    const userId = doc.user_id;
    const itemId = doc.item_id;
    const inventoryData = {"user_id": userId, "item_id": itemId, "expiry_tag": true};
    const res = await editInventory(inventoryData);
    console.log(res);
  });
};

// Query: Get all data from inventories collection
const getInventories = async () => {
  expiryCheck();
  return (await db.collection("inventories").get()).docs.map((inventory) => inventory.data());
};

// Mutation: Add an inventory item
// Required: user_id (int), item_name (string)
const addInventory = async (inventoryData) => {
  const userId = inventoryData.user_id;
  const itemName = inventoryData.item_name;
  const expiryTag = inventoryData.expiry_tag ? inventoryData.expiry_tag : false;
  const usageTag = inventoryData.usage_tag ? inventoryData.usage_tag : "unused";
  const deleteTag = inventoryData.delete_tag ? inventoryData.delete_tag : false;
  const groceryId = inventoryData.grocery_id ? inventoryData.grocery_id : 0;
  const expiryId = 12345; // Pull from API or database
  const inputDate = new Date;
  const expiryDate = new Date; // Pull from API or database and run expiryCalc
  const lastUpdated = inputDate;

  // Check that user_id exists in users collection
  const checkUserId = await util.userIdCheck(userId);

  if (checkUserId) {
    // Get latest item_id for the user
    const latestSnapshot =
      await db.collection("inventories").where("user_id", "==", inventoryData.user_id)
          .orderBy("item_id", "desc").limit(1).get();

    // Increment by 1 to get new item_id or start at 1
    let newItemId = 1;
    if (latestSnapshot.docs.length > 0) {
      newItemId = latestSnapshot.docs[0].data().item_id += 1;
    }
    const newDocId = userId.toString() + "." + newItemId.toString();

    await db.collection("inventories").doc(String(newDocId)).set({
      item_id: newItemId,
      user_id: userId,
      item_name: itemName,
      grocery_id: groceryId,
      expiry_id: expiryId,
      expiry_tag: expiryTag,
      usage_tag: usageTag,
      delete_tag: deleteTag,
      input_date: inputDate,
      expiry_date: expiryDate,
      last_updated: lastUpdated,
    });
    return true;
  }
  return false;
};

// Mutation: Edit fields for a single item
// Required: user_id (int), item_id (int)
const editInventory = async (inventoryData) => {
  let res = false;
  // Check that user_id and item_id combination exists
  const checkIds = await util.inventoryIdCheck(inventoryData.user_id, inventoryData.item_id);

  if (checkIds) {
    const docId = inventoryData.user_id.toString() + "." + inventoryData.item_id.toString();
    const lastUpdated = new Date();
    await db.collection("inventories").doc(String(docId)).update({
      last_updated: lastUpdated,
      ...inventoryData,
    });
    res = true;
  }

  return res;
};

module.exports = {
  getInventories,
  addInventory,
  editInventory,
};
