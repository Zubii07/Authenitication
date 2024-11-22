const express = require("express");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = 10;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials
  })
);

app.use(cookieParser());

// Database connection
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "zohaib",
  database: "signup",
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Status: "Failed", message: "User not authenticated" });
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token not verified" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  res.json({ Status: "Success", name: req.name });
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Register route
app.post("/register", (req, res) => {
  // console.log("in register");
  console.log(req.body);
  const sql = "INSERT INTO LOGIN (`name`,`email`,`password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) {
      //  console.log("Error hashing password:", err);
      return res.json({ Error: "Error for hashing password" });
    }
    const values = [req.body.name, req.body.email, hash];
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.log("Error inserting values:", err);
        return res.json({ Error: "Error for inserting values" });
      }
      res.json({ Status: "Success", message: "Successfully Registered" });
    });
  });
});

// Login route
app.post("/login", (req, res) => {
  console.log(req.body);
  const sql = "SELECT * FROM LOGIN WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login error in server" });

    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (response) {
            const name = data[0].name;
            const token = jwt.sign({ name }, "jwtSecret", {
              expiresIn: `1d`,
            });
            res.cookie("token", token);
            return res.json({
              Status: "Success",
              message: "Successfully Logged In",
            });
          } else {
            res.json({ Status: "Failed", message: "Invalid Password" });
          }
        }
      );
    } else {
      res.json({ Status: "Failed", message: "User not found" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ Status: "Success", message: "Successfully Logged Out" });
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
