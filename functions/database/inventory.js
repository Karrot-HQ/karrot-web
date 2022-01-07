const db = require("./firestore");
const validator = require("../utility_functions/validator.js");
const util = require("../utility_functions/utility.js");

const getInventories = async () => (await db.collection("inventories").get())
    .docs.map((inventory) => inventory.data());

const addInventory = async (inventoryData) => {
  const userId = inventoryData.user_id;
  const itemName = inventoryData.item_name;
  const expiryTag = inventoryData.expiry_tag ? inventoryData.expiry_tag : false;
  // Add enum validator or change to separate tossedTag and usedTag
  const usageTag = inventoryData.usage_tag ? inventoryData.usage_tag : "unused";
  const expiryId = 12345; // Pull from API or database
  const inputDate = new Date; // firebase.firestore.Timestamp.now();
  const expiryDate = new Date; // Pull from API or database

  const validateUserId = validator.validateId(userId);
  const validateItemName = validator.validateAlphaNumeric(itemName);

  let checkUserId = false;
  if (validateUserId && validateItemName) {
    checkUserId = await util.userIdCheck(userId);
  }

  if (checkUserId) {
    const latestSnapshot =
      await db.collection("inventories").where("user_id", "==", inventoryData.user_id)
          .orderBy("item_id", "desc").limit(1).get();

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

const editInventoryTags = async (inventoryData) => {
  const docId = inventoryData.user_id.toString() + "." + inventoryData.item_id.toString();
  let res = false;
  let validateExpiryTag = true;
  let validateUsageTag = true;
  const checkIds = await util.inventoryIdCheck(inventoryData.user_id, inventoryData.item_id);

  if (inventoryData.expiry_tag !== undefined) {
    validateExpiryTag = validator.validateBoolean(inventoryData.expiry_tag);
  }
  if (inventoryData.usage_tag !== undefined) {
    const usageEnum = ["unused", "used", "tossed"];
    validateUsageTag = true;
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
