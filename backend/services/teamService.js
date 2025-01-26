const prisma = require("../config/prisma");

const generateRandomName = () => {
  const firstNames = ["John", "James", "David", "Michael", "Robert", "William", "Thomas", "Daniel", "Paul", "Mark"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const generateRandomPrice = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const createInitialPlayers = () => {
  const players = [];

  // 3 Goalkeepers
  for (let i = 0; i < 3; i++) {
    players.push({
      name: generateRandomName(),
      position: "GK",
      price: generateRandomPrice(500000, 1000000),
      forSale: false
    });
  }

  // 6 Defenders
  for (let i = 0; i < 6; i++) {
    players.push({
      name: generateRandomName(),
      position: "DEF",
      price: generateRandomPrice(400000, 800000),
      forSale: false
    });
  }

  // 6 Midfielders
  for (let i = 0; i < 6; i++) {
    players.push({
      name: generateRandomName(),
      position: "MID",
      price: generateRandomPrice(600000, 1200000),
      forSale: false
    });
  }

  // 5 Attackers
  for (let i = 0; i < 5; i++) {
    players.push({
      name: generateRandomName(),
      position: "ATT",
      price: generateRandomPrice(800000, 1500000),
      forSale: false
    });
  }

  return players;
};

const createTeam = async (userId, email) => {
  try {
    console.log('Creating team for user:', userId);

    const team = await prisma.team.create({
      data: {
        name: `${email.split('@')[0]}'s Team`,
        budget: 5000000,
        userId: userId,
        players: {
          create: createInitialPlayers()
        }
      },
      include: {
        players: true
      }
    });

    console.log('Team created successfully:', team.id);
    return team;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

module.exports = {
  createTeam
};