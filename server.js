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
const { default: connectPgSimple } = await import("connect-pg-simple");
const { default: router } = await import("./src/controllers/routes.js");

(async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Template engine
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "src/views"));

  // Static files
  app.use(express.static(path.join(__dirname, "public")));

  // Parse form data
  app.use(express.urlencoded({ extended: true }));

  //trust first proxy (for render)
  app.set('trust proxy', 1);

  // Initialize PostgreSQL session store
  const pgSession = connectPgSimple(session);
  app.use(
    session({
      store: new pgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Global middleware to set isLoggedIn for UI
  app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
      res.locals.isLoggedIn = true;
    }
    next();
  });

  // Routes
  app.use("/", router);

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.render("pages/error", {
      message: err.message,
      error: err
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
