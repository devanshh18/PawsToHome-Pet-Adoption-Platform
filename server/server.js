import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createError from "http-errors";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import petRoutes from "./routes/petRoute.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import { requestLogger } from "./middleware/requestLogger.js";
import logger from "./utils/logger.js";
import postRoutes from "./routes/postRoute.js";
import shelterRoutes from "./routes/shelterRoutes.js";

// Load env vars
dotenv.config();

const app = express();

// Configure CORS with credentials
const allowedOrigins = [
  "http://localhost:5173",
  "https://paws-to-home-pet-adoption-platform-six.vercel.app",
  "https://pawstohome.live",
  "https://www.pawstohome.live"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("CORS policy does not allow access from this origin")
        );
      }
    },
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("MongoDB Connected"))
  .catch((err) => logger.info("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie parser middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/shelters", shelterRoutes);

// 404 handler
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
