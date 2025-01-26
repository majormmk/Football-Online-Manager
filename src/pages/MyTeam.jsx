import React, { useEffect, useState } from "react";
import { Card, List, Input, Button, message, Typography, Spin, Tag } from "antd";
import { DollarOutlined, ShopOutlined } from "@ant-design/icons";
import { getUserTeam, listPlayerForSale } from "../api/transferApi";

const { Title, Text } = Typography;

const MyTeam = ({ token, userTeamId }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listingPrice, setListingPrice] = useState({});

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getUserTeam(userTeamId, token);
        // Sort players by position in a consistent order
        const sortedPlayers = data.players.sort((a, b) => {
          // Define position order
          const positionOrder = {
            'GK': 1,
            'DEF': 2,
            'MID': 3,
            'ATT': 4
          };
          // First sort by position
          if (positionOrder[a.position] !== positionOrder[b.position]) {
            return positionOrder[a.position] - positionOrder[b.position];
          }
          // If positions are the same, sort by name
          return a.name.localeCompare(b.name);
        });
        setTeam({ ...data, players: sortedPlayers });
      } catch (err) {
        console.error('Error fetching team:', err);
        message.error("Failed to fetch team details");
      } finally {
        setLoading(false);
      }
    };
    if (userTeamId) {
      fetchTeam();
    }
  }, [userTeamId, token]);

  const handleListForSale = async (playerId) => {
    try {
      await listPlayerForSale(playerId, listingPrice[playerId], token);
      message.success("Player listed for sale!");
      // Fetch updated team data
      const updatedData = await getUserTeam(userTeamId, token);
      // Apply the same sorting to the updated data
      const sortedPlayers = updatedData.players.sort((a, b) => {
        const positionOrder = {
          'GK': 1,
          'DEF': 2,
          'MID': 3,
          'ATT': 4
        };
        if (positionOrder[a.position] !== positionOrder[b.position]) {
          return positionOrder[a.position] - positionOrder[b.position];
        }
        return a.name.localeCompare(b.name);
      });

      setTeam({ ...updatedData, players: sortedPlayers });
    } catch (err) {
      message.error("Failed to list player for sale");
    }
  };
  
  return (
    <Spin spinning={loading} size="large">
    <Card
      title={
        <div>
          <Title level={2}>⚽ {team?.name}</Title>
          <Text>Budget: ${team?.budget.toLocaleString()}</Text>
        </div>
      }
    >
      <List
        itemLayout="horizontal"  
        dataSource={team?.players || []}
        renderItem={player => (
          <List.Item
            actions={[
              !player.forSale && (
                <div key="list-actions">
                  <Input
                    type="number"
                    placeholder="Set price"
                    style={{ width: 120, marginRight: 8 }}
                    onChange={(e) =>
                      setListingPrice({
                        ...listingPrice,
                        [player.id]: parseFloat(e.target.value)
                      })
                    }
                    prefix={<DollarOutlined />}
                  />
                  <Button 
                    type="primary"
                    icon={<ShopOutlined />}
                    onClick={() => handleListForSale(player.id)}
                    disabled={!listingPrice[player.id]}
                  >
                    List for Sale
                  </Button>
                </div>
              )
            ]}
          >
            <List.Item.Meta
              title={
                <span>
                  {player.name}{' '}
                  <Tag color={
                    player.position === 'GK' ? 'green' :
                    player.position === 'DEF' ? 'blue' :
                    player.position === 'MID' ? 'orange' :
                    'red'
                  }>
                    {player.position}
                  </Tag>
                  {player.forSale && <Tag color="gold">For Sale</Tag>}
                </span>
              }
              description={
                <>
                  <div>Value: ${player.price.toLocaleString()}</div>
                  {player.forSale && <div>Listed for: ${player.askPrice.toLocaleString()}</div>}
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
    </Spin>
  );
};

export default MyTeam;