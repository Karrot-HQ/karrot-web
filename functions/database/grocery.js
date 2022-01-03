const db = require("./firestore");

const getGroceries = async () => (await db.collection("groceries").get())
    .docs.map((grocery) => grocery.data());

const addGrocery = async (groceryData) => {
  const latestItemId =
    await db.collection("groceries").where("user_id", "==", groceryData.user_id)
        .orderBy("item_id", "desc").limit(1).get();
  let newItemId = 1;
  if (latestItemId.docs.length > 0) {
    newItemId = latestItemId.docs[0].data().item_id += 1;
    return newItemId;
  }
  const newDocId = groceryData.user_id.toString() + "." + newItemId.toString();

  await db.collection("groceries").doc(String(newDocId)).set({
    item_id: newItemId,
    ...groceryData,
  });
  return true;
};

const editGrocery = async (groceryData) => {

};

module.exports = {
  getGroceries,
  addGrocery,
  // editGrocery,
};
