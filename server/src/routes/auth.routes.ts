import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const router = Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "devconnect-secret";

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Password must be at least 6 characters",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: cleanEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        data: null,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
      },

      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        avatar: true,
        githubUrl: true,
        linkedinUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      message: "Registration successful",
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);

    return res.status(500).json({
      success: false,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
});

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: cleanEmail,
      },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      avatar: user.avatar,
      githubUrl: user.githubUrl,
      linkedinUrl: user.linkedinUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
});

export default router;