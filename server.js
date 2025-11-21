import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Required for resolving paths in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true on Render (HTTPS)
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Routes
app.use("/", router);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
