const { log } = require("../../../utils/logger");
const { db } = require("../mongo");

async function setUserInfo({ email, data }) {
  log.debug("Set password for login: " + email);
  return db.USERS.findOneAndUpdate(
    { email },
    { $set: data },
    { upsert: true, returnDocument: "after", returnNewDocument: true }
  ).then((user) => {
    log.info("Updated user: " + user.value);
    return user.value;
  });
}

module.exports.setUserInfo = setUserInfo;