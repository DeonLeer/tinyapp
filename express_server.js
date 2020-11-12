const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

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
  res.clearCookie('username');
  res.redirect("/urls");
})


//shows all URLs
app.get("/urls/", (req, res) => {

  const templateVars = {urls: urlDatabase, username: req.cookies["username"]};

  res.render("urls_index", templateVars);
})

//New URL submission form
app.get("/urls/new", (req, res) => {

  const templateVars= {username: req.cookies["username"]}

  res.render("urls_new", templateVars);
})

app.get("/urls/register", (req, res) => {

  const templateVars= {username: req.cookies["username"]}

  res.render("urls_register", templateVars);
})

//shows specific URL
app.get("/urls/:shortURL", (req, res) => {

  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};

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

  const templateVars = {shortURL: req.params.shortURL, longURL: req.body.editURL, username: req.cookies["username"]};

  urlDatabase[req.params.shortURL] = req.body.editURL;

  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});