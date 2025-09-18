import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./config/env";
import eventRoutes from "./routes/event.routes";
import { initDB } from "./lib/db";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./lib/logger";
import { apiLimiter } from "./middleware/rateLimiter";
import { setupSwagger } from "./lib/swagger"; // <-- import swagger setup

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

// ✅ Morgan logs incoming HTTP requests
app.use(morgan("dev"));

// ✅ Apply rate limiter BEFORE routes
app.use("/api/", apiLimiter);

// ✅ Swagger UI route (before error handler)
setupSwagger(app);

// Routes
app.use("/api/events", eventRoutes);

// ✅ Error handling middleware (after all routes)
app.use(errorHandler);

// Initialize DB and start server
initDB().then(() => {
  app.listen(ENV.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${ENV.PORT}`);
  });
});
