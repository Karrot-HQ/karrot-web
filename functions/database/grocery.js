const db = require("./firestore");
const validator = require("../utility_functions/validator.js");
const util = require("../utility_functions/utility.js");

const getGroceries = async () => (await db.collection("groceries").get())
    .docs.map((grocery) => grocery.data());

const addGrocery = async (groceryData) => {
  const userId = groceryData.user_id;
  const itemName = groceryData.item_name;
  const deleteTag = groceryData.delete_tag ? groceryData.delete_tag : false;
  const boughtTag = groceryData.bought_tag ? groceryData.bought_tag : false;
  const inputDate = new Date; // firebase.firestore.Timestamp.now();

  const validateUserId = validator.validateId(userId);
  const validateItemName = validator.validateAlphaNumeric(itemName);

  let checkUserId = false;
  if (validateUserId && validateItemName) {
    checkUserId = await util.userIdCheck(userId);
  }

  if (checkUserId) {
    const latestSnapshot =
      await db.collection("groceries").where("user_id", "==", userId)
          .orderBy("item_id", "desc").limit(1).get();

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

const editGroceryTags = async (groceryData) => {
  const docId = groceryData.user_id.toString() + "." + groceryData.item_id.toString();
  let res = false;
  let validateBoughtTag = true;
  let validateDeleteTag = true;
  const checkIds = await util.groceryIdCheck(groceryData.user_id, groceryData.item_id);

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
