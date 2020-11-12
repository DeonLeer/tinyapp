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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

  res.cookie("username", req.body.username);

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
    console.log(users[user]["email"]);
    if (users[user]["email"] === email) {
      return res.status(400).send("Another user is using that email");
    }
  }

  users[id] = {id, email, password};
  res.cookie("user_id", id);
  res.redirect("/urls");
  })

//shows all URLs
app.get("/urls/", (req, res) => {

  const templateVars = {urls: urlDatabase, user: users[req.cookies["user_id"]]};

  res.render("urls_index", templateVars);
})

//New URL submission form
app.get("/urls/new", (req, res) => {

  const templateVars= {user: users[req.cookies["user_id"]]}

  res.render("urls_new", templateVars);
})

//Registration page
app.get("/urls/register", (req, res) => {

  const templateVars= {user: users[req.cookies["user_id"]]}

  res.render("urls_register", templateVars);
})

//shows specific URL
app.get("/urls/:shortURL", (req, res) => {

  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_id"]]};

  res.render("urls_show", templateVars);
})

//redirects to longURL
app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

//Creates new Short URL and redirects to URL page
app.post("/urls", (req, res) => {

  let newid = generateRandomString();

  urlDatabase[newid] = req.body["longURL"];

  res.redirect(`/urls/${newid}`);
})

//Deleted URLs from database
app.post("/urls/:shortURL/delete", (req, res) => {

  delete urlDatabase[req.params.shortURL];

  res.redirect("/urls");
})

//Edit URL
app.post("/urls/:shortURL", (req, res) => {

  const templateVars = {shortURL: req.params.shortURL, longURL: req.body.editURL, user: users[res.cookie["user_id"]]};

  urlDatabase[req.params.shortURL] = req.body.editURL;

  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});