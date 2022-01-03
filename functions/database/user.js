const db = require("./firestore");

const getUsers = async () => (await db.collection("users").get())
    .docs.map((user) => user.data());

const addUser = async (userData) => {
  const latestUserId = await db.collection("users").orderBy("user_id", "desc").limit(1).get();
  const newUserId = latestUserId.docs[0].data().user_id += 1;

  await db.collection("users").doc(String(newUserId)).set({
    user_id: newUserId,
    ...userData,
  });
  return true;
};

module.exports = {
  getUsers,
  addUser,
};
