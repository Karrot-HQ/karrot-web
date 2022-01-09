const db = require("../firestore");

// Query: Get all data from users collection
const getUsers = async () => (
  await db.collection("users").get()).docs.map((user) => user.data());

// Mutation: Add an user
// Required: email (string)
const addUser = async (userData) => {
  // Check that email doesn't already exist in database
  const emailRes = await db.collection("users").where("email", "==", userData.email).get();
  const checkEmail = emailRes.docs.length == 0 ? true : false;

  if (checkEmail) {
    const latestSnapshot = await db.collection("users").orderBy("user_id", "desc").limit(1).get();
    const newUserId = latestSnapshot.docs[0].data().user_id += 1;

    const inputDate = new Date();
    const lastUpdated = inputDate;

    await db.collection("users").doc(String(newUserId)).set({
      user_id: newUserId,
      input_date: inputDate,
      last_updated: lastUpdated,
      ...userData,
    });
    return true;
  }
  return false;
};

module.exports = {
  getUsers,
  addUser,
};
