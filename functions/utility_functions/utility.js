const db = require("../database/firestore");

const userIdCheck = async (userId) => {
  const userIdRes = await db.collection("users").where("user_id", "==", userId).get();
  const check = userIdRes.docs.length == 1 ? true : false;
  return check;
};

const groceryIdCheck = async (userId, itemId) => {
  const itemIdRes = await db.collection("groceries")
      .where("user_id", "==", userId).where("item_id", "==", itemId).get();
  const check = itemIdRes.docs.length == 1 ? true : false;
  return check;
};

const inventoryIdCheck = async (userId, itemId) => {
  const itemIdRes = await db.collection("inventories")
      .where("user_id", "==", userId).where("item_id", "==", itemId).get();
  const check = itemIdRes.docs.length == 1 ? true : false;
  return check;
};

module.exports = {
  userIdCheck,
  groceryIdCheck,
  inventoryIdCheck,
};
