const db = require("./firestore");
const validator = require("../utility_functions/validator.js");
const util = require("../utility_functions/utility.js");

// Query: Get all data from inventories collection
const getInventories = async () => (await db.collection("inventories").get())
    .docs.map((inventory) => inventory.data());

// Mutation: Add an inventory item
// Required: user_id (int), item_name (string)
// Optional: expiry_tag (boolean), usage_tag (enum: unused, used, tossed)
const addInventory = async (inventoryData) => {
  const userId = inventoryData.user_id;
  const itemName = inventoryData.item_name;
  const expiryTag = inventoryData.expiry_tag ? inventoryData.expiry_tag : false;
  const usageTag = inventoryData.usage_tag ? inventoryData.usage_tag : "unused";
  const expiryId = 12345; // Pull from API or database
  const inputDate = new Date; // firebase.firestore.Timestamp.now();
  const expiryDate = new Date; // Pull from API or database

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
      await db.collection("inventories").where("user_id", "==", inventoryData.user_id)
          .orderBy("item_id", "desc").limit(1).get();

    // Increment by 1 to get new item_id or start at 1
    let newItemId = 1;
    if (latestSnapshot.docs.length > 0) {
      newItemId = latestSnapshot.docs[0].data().item_id += 1;
    }
    const newDocId = userId.toString() + newItemId.toString();

    await db.collection("inventories").doc(String(newDocId)).set({
      item_id: newItemId,
      user_id: userId,
      item_name: itemName,
      expiry_id: expiryId,
      expiry_tag: expiryTag,
      usage_tag: usageTag,
      input_date: inputDate,
      expiry_date: expiryDate,
    });
    return true;
  }
  return false;
};

// Mutation: Edit expiry_tag and/or usage_tag
// Required: user_id (int), item_id (int), one of 1) expiry_tag (boolean), 2) usage_tag (enum)
const editInventoryTags = async (inventoryData) => {
  const docId = inventoryData.user_id.toString() + "." + inventoryData.item_id.toString();
  let res = false;
  let validateExpiryTag = true;
  let validateUsageTag = true;
  // Check that user_id and item_id combination exists
  const checkIds = await util.inventoryIdCheck(inventoryData.user_id, inventoryData.item_id);

  // Check that tags are in correct format
  if (inventoryData.expiry_tag !== undefined) {
    validateExpiryTag = validator.validateBoolean(inventoryData.expiry_tag);
  }
  if (inventoryData.usage_tag !== undefined) {
    const usageEnum = ["unused", "used", "tossed"];
    validateUsageTag = usageEnum.includes(inventoryData.usage_tag);
  }

  if (checkIds && validateExpiryTag && validateUsageTag) {
    if (inventoryData.expiry_tag !== undefined && inventoryData.usage_tag !== undefined) {
      await db.collection("inventories").doc(String(docId)).update({
        expiry_tag: inventoryData.expiry_tag,
        usage_tag: inventoryData.usage_tag,
      });
      res = true;
    } else if (inventoryData.expiry_tag !== undefined) {
      await db.collection("inventories").doc(String(docId)).update({
        expiry_tag: inventoryData.expiry_tag,
      });
      res = true;
    } else if (inventoryData.usage_tag !== undefined) {
      await db.collection("inventories").doc(String(docId)).update({
        usage_tag: inventoryData.usage_tag,
      });
      res = true;
    }
  }
  return res;
};

module.exports = {
  getInventories,
  addInventory,
  editInventoryTags,
};
