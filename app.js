const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");

const session = require('express-session')

const Tourist = require('./models/tourist')
const User = require('./models/user')
const Contact = require("./models/contact")

const passport = require("passport");
const LocalStrategy = require("passport-local");

const flash = require("connect-flash");
const{isLoggedIn} =require("./middleware");

require('dotenv').config()

const app = express();

const sessionOptions = {
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge:7 * 24 * 60 * 60 * 1000,
      httpOnly: true
  }
}

app.use(session(sessionOptions))
app.use(flash())

app.use((req,res,next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.curruser = req.user
  next()
})

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

main().then((res) => {console.log("Connection successful.");}).catch(err => console.log(err));

app.listen(5000, (req, res) => {
  console.log("Port is listening to port");
});

app.get("/", (req, res) => {
  res.render("home/home.ejs");
});

app.get("/signin", (req, res) => {
  res.render("user/signin.ejs");
});

app.post("/signin", passport.authenticate('local',{failureRedirect:"/signin", failureFlash:true}) , (req,res)=>{
  req.flash("success","Welcome back!")
  // console.log(req.user);
  res.redirect("/")
})

app.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

app.post("/signup", async (req, res) => {
  let {name,username,email,password} = req.body;
  const newUser = new User({name,username,email,password});
  const regsiteredUser = await User.register(newUser,password);
  req.flash("success","you are registered!")
  res.redirect("/")
  // req.login(regsiteredUser,(err)=>{
  //     console.log(err)
  //     res.redirect('/login')
  // })
});

app.get("/logout",(req,res)=>{
  req.logout((err)=>{
      // res.redirect("/")
      console.log("i am logged out")
  });
})


app.get("/aboutus", (req, res) => {
  res.render("us/aboutus.ejs");
});

app.get("/contactus", (req, res) => {
  res.render("us/contactus.ejs");
});
app.post("/contactus", async (req, res) => {
  let {name,email,message} = req.body;
  const newContact = Contact.create({name,email,message})
  // await newContact.save()
  res.redirect("/")
});

app.get("/tourist-guide", isLoggedIn, async (req, res) => {
  const tourists = await Tourist.find({}).limit(5);
  res.render("services/tourist.ejs", {tourists});
});
app.get("/tourist-guides", isLoggedIn, async (req, res) => {
  let input = req.query.input
  const tourists = await Tourist.find({tourist_city:{$regex:input, $options:'i'}});
  res.json(tourists)
});
app.get("/tourist-guidess", isLoggedIn, async (req, res) => {
  const tourists = await Tourist.find({}).limit(5);
  res.json(tourists)
});

app.get("/bookings", isLoggedIn, (req, res) => {
  res.render("services/bookings.ejs");
});

app.get("/hotels", isLoggedIn, (req, res) => {
  res.render("services/hotels.ejs");
});
