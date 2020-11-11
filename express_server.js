const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
}

//root directory says hello
app.get("/", (req, res) => {
  res.send("Hello!");
});

//json string of object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

//shows all URLs
app.get("/urls/", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
})

//New URL submission form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})

//shows specific URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
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


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});