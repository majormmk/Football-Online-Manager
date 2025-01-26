const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// Get team details
router.get("/:teamId", async (req, res) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: req.params.teamId },
      include: {
        players: true
      }
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update team name
router.put("/:teamId", async (req, res) => {
  try {
    const { name } = req.body;
    const team = await prisma.team.update({
      where: { id: req.params.teamId },
      data: { name },
      include: { players: true }
    });

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;