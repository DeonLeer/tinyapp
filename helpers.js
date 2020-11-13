const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
}
const urlsForUser = function(id, database, users) {
  let userURLS = {}
  for (let url in database) {
    if (database[url]["userID"] === users[id]["id"])
    userURLS[url] = {longURL: database[url].longURL, userID: database[url].userID}
  }
  return userURLS;
}
const generateRandomString = function() {
  return Math.random().toString(36).substr(2,6);
}

const funcs = {getUserByEmail, urlsForUser, generateRandomString}


module.exports = funcs;