const db = require("../database/firestore");
const inventory = require("../database/collections/inventory_collection");
const schedule = require("../node_modules/node-schedule");
const rule = new schedule.RecurrenceRule();
rule.hour = 0; // runs once a day at midnight
// rule.minute = new schedule.Range(0, 59, 1);

const expiryCheck = async () => {
  const currentDate = new Date();
  const expiredItems = await db.collection("inventories").where("expiry_tag", "==", false)
      .where("expiry_date", "<", currentDate).get();
  expiredItems.forEach((doc) => {
    const userId = doc.user_id;
    const itemId = doc.item_id;
    const inventoryData = {"inventory": {"user_id": userId, "item_id": itemId, "expiry_tag": true}};
    inventory.editInventory(inventoryData);
  });
};

// eslint-disable-next-line no-unused-vars
/* const expiryCheckScheduler = schedule.scheduleJob(rule, () => {
  expiryCheck();
  console.log("Finished expiry check.");
});*/

const expiryCheckScheduler = schedule.scheduleJob("*/5* * * *", () => {
  expiryCheck();
  console.log("Finished expiry check.");
});

expiryCheckScheduler();
