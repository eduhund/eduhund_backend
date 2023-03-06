const { log } = require("../../../utils/logger");
const { db } = require("../mongo");

function getModulesList({ query = {}, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return db.MODULES.find(query, {
    projection,
  }).toArray();
}

module.exports.getModulesList = getModulesList;
