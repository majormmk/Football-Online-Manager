const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { createTeam } = require("../services/teamService");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: "MISSING_FIELDS",
        message: "Email and password are required" 
      });
    }

    // Find existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        team: {
          include: { players: true }
        }
      }
    });

    // Handle existing user
    if (existingUser) {
      const isValidPassword = await bcrypt.compare(password, existingUser.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: "INVALID_PASSWORD",
          message: "Incorrect password"
        });
      }

      const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      return res.json({
        token,
        userId: existingUser.id,
        teamId: existingUser.team?.id,
        team: existingUser.team,
        isNewUser: false
      });
    }

    // Handle new user registration
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    });

    // Create team
    const team = await createTeam(newUser.id, email);

    // Generate token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      userId: newUser.id,
      teamId: team.id,
      team,
      isNewUser: true
    });

  } catch (error) {
    console.error('Auth error:', error);
    
    // Handle specific database errors
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({
        error: "EMAIL_TAKEN",
        message: "This email is already registered"
      });
    }

    res.status(500).json({ 
      error: "SERVER_ERROR",
      message: "Authentication failed" 
    });
  }
});

module.exports = router;