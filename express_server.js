const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "userRandomID"},
};

function urlsForUser(id) {
  let userURLS = {}
  for (let url in urlDatabase) {
    console.log(urlDatabase[url]["userID"], users[id]["id"])
    if (urlDatabase[url]["userID"] === users[id]["id"])
    userURLS[url] = {longURL: urlDatabase[url].longURL, userID: urlDatabase[url].userID}
  }
  return userURLS;
}

function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
}

//hello
app.get("/", (req, res) => {
  res.send("Hello!");
});

//json string of object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

//Login
app.post("/urls/login", (req, res) => {

  const email = req.body.email;
  console.log(email);
  const password = req.body.password;

  if (!password || !email) {
    return res.status(400).send("please provide an email and password");
  }
  let emailFound;
  for (let user in users) {
    if (users[user]["email"] === email) {
      emailFound = users[user];
    }
  }
  if (!emailFound) {
    res.status(403).send("no user with this email found. try registering an account");
  } 
  if (emailFound.password !== password) {
    res.status(403).send("incorrect password");
  }

    res.cookie("user_id", emailFound["id"]);
    res.redirect("/urls");


})

//Logout
app.post("/urls/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
})

//Register
app.post("/urls/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!password || !email) {
    return res.status(400).send("please provide an email and password");
  }
  for (let user in users) {
    if (users[user]["email"] === email) {
      return res.status(400).send("Another user is using that email");
    }
  }

  users[id] = {id, email, password};
  console.log(users);
  res.cookie("user_id", id);
  res.redirect("/urls");
  })

//shows all URLs
app.get("/urls/", (req, res) => {
  if (!req.cookies["user_id"]) {
    const templateVars = {urls: false, user: users[req.cookies["user_id"]]}
    res.render("urls_index", templateVars)
  }
  let shownURLS = urlsForUser(req.cookies["user_id"]);
  const templateVars = {urls: shownURLS, user: users[req.cookies["user_id"]]};

  res.render("urls_index", templateVars);
})

//New URL submission form
app.get("/urls/new", (req, res) => {

  const templateVars= {user: users[req.cookies["user_id"]]}

  if (!templateVars["user"]) {
    res.redirect("/urls/login");
  }

  res.render("urls_new", templateVars);
})

//Registration page
app.get("/urls/register", (req, res) => {

  const templateVars= {user: users[req.cookies["user_id"]]};

  res.render("urls_register", templateVars);
})

//Login page
app.get("/urls/login", (req, res) => {

  const templateVars= {user: users[req.cookies["user_id"]]}

  res.render("urls_login", templateVars);
  
})

//shows specific URL
app.get("/urls/:shortURL", (req, res) => {

  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.cookies["user_id"]]};

  console.log(templateVars)

  if (!templateVars["user"]) {
    res.redirect("/urls/login");
  }
  if (templateVars["user"]["id"] !== urlDatabase[req.params.shortURL]["userID"]) {
    res.redirect("/urls");
  }
  

  res.render("urls_show", templateVars);
})

//redirects to longURL
app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[req.params.shortURL]["longURL"];

  res.redirect(longURL);
});

//Creates new Short URL and redirects to URL page
app.post("/urls", (req, res) => {

  let newid = generateRandomString();

  urlDatabase[newid] = {longURL: req.body["longURL"], userID: users[req.cookies["user_id"]]["id"]};

  res.redirect(`/urls/`);
})

//Deleted URLs from database
app.post("/urls/:shortURL/delete", (req, res) => {

  const templateVars = {user: users[req.cookies["user_id"]]};

  if (!templateVars["user"]) {
    res.redirect("/urls/login");
  }
  if (templateVars["user"]["id"] !== urlDatabase[req.params.shortURL]["userID"]) {
    res.redirect("/urls");
  }

  delete urlDatabase[req.params.shortURL];

  res.redirect("/urls");
})

//Edit URL
app.post("/urls/:shortURL", (req, res) => {



  const templateVars = {shortURL: req.params.shortURL, longURL: req.body.editURL, user: users[req.cookies["user_id"]]};

  urlDatabase[req.params.shortURL].longURL = req.body.editURL;

  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});