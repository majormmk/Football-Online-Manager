import axios from "./axiosConfig";

const TRANSFER_URL = "/transfer";

export const getUserTeam = async (teamId) => {
  try {
    if (!teamId) {
      throw new Error("Team ID is required");
    }
    console.log("Fetching team with ID:", teamId);

    const response = await axios.get(`${TRANSFER_URL}/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
};

export const getTransferMarket = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });
    const response = await axios.get(
      `${TRANSFER_URL}/list?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transfer market:", error);
    throw error;
  }
};

export const listPlayerForSale = async (playerId, price) => {
  try {
    const response = await axios.put(`${TRANSFER_URL}/sell`, {
      playerId,
      price,
    });
    return response.data;
  } catch (error) {
    console.error("Error listing player for sale:", error);
    throw error;
  }
};

export const buyPlayer = async (playerId, buyerTeamId) => {
  try {
    const response = await axios.post(`${TRANSFER_URL}/buy`, {
      playerId,
      buyerTeamId,
    });
    return response.data;
  } catch (error) {
    console.error("Error buying player:", error);
    throw error;
  }
};
