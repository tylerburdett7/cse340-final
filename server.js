import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    if (line.trim() && !line.startsWith("#")) {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=").trim();
      process.env[key.trim()] = value;
    }
  });
}

const { default: express } = await import("express");
const { default: session } = await import("express-session");
const { default: router } = await import("./routes/index.js");

(async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

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
        secure: false, 
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
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
