import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const router = Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "devconnect-secret";

// =====================================================
// UPDATE PROFILE
// PUT /api/users/profile
// =====================================================

router.put("/profile", async (req, res) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Authentication required",
      });
    }

    // Get JWT token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Authentication token missing",
      });
    }

    // Verify JWT
    let decoded: {
      userId?: string;
      id?: string;
    };

    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId?: string;
        id?: string;
      };
    } catch (error) {
      console.error("JWT verification error:", error);

      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid or expired authentication token",
      });
    }

    // Get user ID from token
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid authentication token",
      });
    }

    // Get profile data
    const {
      name,
      bio,
      location,
      githubUrl,
      linkedinUrl,
    } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Name is required",
      });
    }

    // Update profile in database
    const user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        name: name.trim(),

        bio:
          typeof bio === "string" && bio.trim()
            ? bio.trim()
            : null,

        location:
          typeof location === "string" && location.trim()
            ? location.trim()
            : null,

        githubUrl:
          typeof githubUrl === "string" && githubUrl.trim()
            ? githubUrl.trim()
            : null,

        linkedinUrl:
          typeof linkedinUrl === "string" &&
          linkedinUrl.trim()
            ? linkedinUrl.trim()
            : null,
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

    // Success response
    return res.json({
      success: true,
      data: {
        user,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      data: null,
      message: "Unable to update profile",
    });
  }
});

export default router;