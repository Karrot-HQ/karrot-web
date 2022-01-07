const db = require("./firestore");
const validator = require("../utility_functions/validator.js");

const getUsers = async () => (
  await db.collection("users").get()).docs.map((user) => user.data());

const addUser = async (userData) => {
  const validateEmail = validator.validateEmail(userData.email);
  let checkEmail = false;
  if (validateEmail) {
    const emailRes = await db.collection("users").where("email", "==", userData.email).get();
    checkEmail = emailRes.docs.length == 0 ? true : false;
  }

  if (checkEmail) {
    const latestSnapshot = await db.collection("users").orderBy("user_id", "desc").limit(1).get();
    const newUserId = latestSnapshot.docs[0].data().user_id += 1;

    await db.collection("users").doc(String(newUserId)).set({
      user_id: newUserId,
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
