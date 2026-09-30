import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// -------------------------
// Middleware
// -------------------------

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// -------------------------
// Authentication routes
// -------------------------

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

// -------------------------
// Root route
// -------------------------

app.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      name: "DevConnect API",
      status: "running",
    },
    message: "DevConnect backend is running",
  });
});

// -------------------------
// Health check
// -------------------------

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      data: {
        status: "healthy",
        database: "connected",
      },
      message: "API and database are healthy",
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      success: false,
      data: null,
      message: "Database connection failed",
    });
  }
});

// -------------------------
// Start server
// -------------------------

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(
    `DevConnect API running on http://127.0.0.1:${PORT}`
  );
});

// -------------------------
// Server error handling
// -------------------------

server.on("error", (error) => {
  console.error("SERVER ERROR:", error);
});

server.on("close", () => {
  console.log("SERVER CLOSED");
});

// Temporary development keep-alive
setInterval(() => {
  // Keep the Node process alive during local development
}, 1000);