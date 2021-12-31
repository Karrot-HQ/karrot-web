const db = require("./firestore");

const getUsers = async () => (await db.collection("users").get())
    .docs.map((user) => user.data());

module.exports = {
  getUsers,
};
