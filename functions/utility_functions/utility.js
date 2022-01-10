const db = require("../database/firestore");
const {editInventory} = require("../database/collections/inventory_collection");

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

const expiryCalc = (inputDate, expiryTime) => {
  const newDate = inputDate.setDate(inputDate.getDate() + expiryTime);
  // Check if expiryTime needs to be converted to days
  const expiryDate = new Date(newDate);
  return expiryDate;
};

// Update expiry_tag based on current date
const expiryCheck = async () => {
  const currentDate = new Date();
  const expiredItems = (await db.collection("inventories").where("expiry_tag", "==", false)
      .where("expiry_date", "<=", currentDate).get()).docs.map((items) => items.data());
  expiredItems.forEach(async (doc) => {
    const userId = doc.user_id;
    const itemId = doc.item_id;
    const inventoryData = {"user_id": userId, "item_id": itemId, "expiry_tag": true};
    const res = await editInventory(inventoryData);
    console.log(res);
  });
};

module.exports = {
  userIdCheck,
  groceryIdCheck,
  inventoryIdCheck,
  expiryCalc,
  expiryCheck,
};
