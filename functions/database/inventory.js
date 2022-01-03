const db = require("./firestore");

const getInventories = async () => (await db.collection("inventories").get())
    .docs.map((inventory) => inventory.data());

const addInventory = async (inventoryData) => {
  const latestItemId =
    await db.collection("inventories").where("user_id", "==", inventoryData.user_id)
        .orderBy("item_id", "desc").limit(1).get();
  let newItemId = 1;
  if (latestItemId.docs.length > 0) {
    newItemId = latestItemId.docs[0].data().item_id += 1;
    return newItemId;
  }
  const newDocId = inventoryData.userId.toString() + newItemId.toString();

  await db.collection("inventories").doc(String(newDocId)).set({
    item_id: newItemId,
    ...inventoryData,
  });
  return true;
};

const editInventory = async (inventoryData) => {

};

module.exports = {
  getInventories,
  addInventory,
  // editInventory,
};
