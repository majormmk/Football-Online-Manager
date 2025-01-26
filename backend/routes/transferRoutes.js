const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// Get team details
router.get("/team/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    console.log('Fetching team with ID:', teamId);

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        players: true
      }
    });

    if (!team) {
      console.log('Team not found:', teamId);
      return res.status(404).json({ message: "Team not found" });
    }

    console.log('Team found:', team.id);
    res.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: "Error fetching team details" });
  }
});

// Get all players in transfer market with filters
router.get("/list", async (req, res) => {
  try {
    const { playerName, teamName, position, minPrice, maxPrice } = req.query;

    // Build filter conditions
    const whereConditions = {
      forSale: true,
      AND: []
    };

    // Add filters only if they exist
    if (playerName) {
      whereConditions.AND.push({
        name: { contains: playerName, mode: 'insensitive' }
      });
    }

    if (position) {
      whereConditions.AND.push({ position });
    }

    if (teamName) {
      whereConditions.AND.push({
        team: {
          name: { contains: teamName, mode: 'insensitive' }
        }
      });
    }

    if (minPrice) {
      whereConditions.AND.push({
        askPrice: { gte: parseFloat(minPrice) }
      });
    }

    if (maxPrice) {
      whereConditions.AND.push({
        askPrice: { lte: parseFloat(maxPrice) }
      });
    }

    // Remove AND array if empty
    if (whereConditions.AND.length === 0) {
      delete whereConditions.AND;
    }

    const players = await prisma.player.findMany({
      where: whereConditions,
      include: {
        team: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: [
        { askPrice: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json(players);
  } catch (error) {
    console.error("Error fetching transfer market:", error);
    res.status(500).json({ 
      message: "Error fetching transfer market",
      error: error.message 
    });
  }
});

// List player for sale
router.put("/sell", async (req, res) => {
  const { playerId, price } = req.body;
  
  try {
    // Get team's current player count
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { team: { include: { players: true } } }
    });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Check if team would have minimum 15 players after sale
    const currentPlayers = player.team.players.length;
    const forSalePlayers = player.team.players.filter(p => p.forSale).length;
    
    if (currentPlayers - forSalePlayers - 1 < 15) {
      return res.status(400).json({ 
        message: "Cannot list player for sale. Team must maintain minimum 15 players." 
      });
    }

    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: { 
        forSale: true,
        askPrice: parseFloat(price)
      }
    });

    res.json(updatedPlayer);
  } catch (error) {
    console.error("Error listing player:", error);
    res.status(500).json({ message: "Error listing player for sale" });
  }
});

// Buy player
router.post("/buy", async (req, res) => {
  const { playerId, buyerTeamId } = req.body;

  try {
    // Start transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Get player and teams
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        include: { team: true }
      });

      const buyerTeam = await prisma.team.findUnique({
        where: { id: buyerTeamId },
        include: { players: true }
      });

      if (!player || !buyerTeam) {
        throw new Error("Invalid transaction details");
      }

      // Validate team size constraints
      if (buyerTeam.players.length >= 25) {
        throw new Error("Buyer team already has maximum 25 players");
      }

      // Calculate 95% of asking price
      const finalPrice = player.askPrice * 0.95;

      // Check if buyer has enough budget
      if (buyerTeam.budget < finalPrice) {
        throw new Error("Insufficient funds");
      }

      // Update player
      const updatedPlayer = await prisma.player.update({
        where: { id: playerId },
        data: {
          teamId: buyerTeamId,
          forSale: false,
          askPrice: null
        }
      });

      // Update team budgets
      await prisma.team.update({
        where: { id: buyerTeamId },
        data: { budget: { decrement: finalPrice } }
      });

      await prisma.team.update({
        where: { id: player.team.id },
        data: { budget: { increment: finalPrice } }
      });

      return updatedPlayer;
    });

    res.json(result);
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Cancel sale listing
router.put("/cancel-sale", async (req, res) => {
  const { playerId } = req.body;

  try {
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: { 
        forSale: false,
        askPrice: null
      }
    });

    res.json(updatedPlayer);
  } catch (error) {
    console.error("Error canceling sale:", error);
    res.status(500).json({ message: "Error canceling sale listing" });
  }
});

module.exports = router;