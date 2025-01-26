import React, { useEffect, useState } from "react";
import { 
  Card, 
  List, 
  Button, 
  Input, 
  Form, 
  Row, 
  Col, 
  message, 
  Typography, 
  Spin,
  Select,
  InputNumber,
  Space,
  Tag
} from "antd";
import { 
  ShoppingCartOutlined, 
  SearchOutlined, 
  FilterOutlined,
  ClearOutlined 
} from "@ant-design/icons";
import { getTransferMarket, buyPlayer } from "../api/transferApi";

const { Title, Text } = Typography;
const { Option } = Select;

const TransferMarket = ({ token, userTeamId }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const fetchPlayers = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getTransferMarket(filters);
      setPlayers(data);
    } catch (err) {
      message.error("Failed to fetch transfer market.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleSearch = async (values) => {
    // Convert empty strings to undefined
    const filters = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== '')
    );
    await fetchPlayers(filters);
  };

  const handleReset = () => {
    form.resetFields();
    fetchPlayers();
  };

  const handleBuy = async (playerId, sellerTeamId, askPrice) => {
    try {
      await buyPlayer(playerId, userTeamId, token);
      message.success("Player purchased successfully!");
      fetchPlayers(form.getFieldsValue()); // Refresh with current filters
    } catch (err) {
      message.error(err.response?.data?.message || "Error buying player");
    }
  };

  return (
    <Card title={<Title level={2}>⚽ Transfer Market</Title>}>
      <Form
        form={form}
        onFinish={handleSearch}
        layout="vertical"
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="playerName" label="Player Name">
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Search players"
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="teamName" label="Team Name">
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Search teams"
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="position" label="Position">
              <Select 
                placeholder="Select position"
                allowClear
              >
                <Option value="GK">Goalkeeper</Option>
                <Option value="DEF">Defender</Option>
                <Option value="MID">Midfielder</Option>
                <Option value="ATT">Attacker</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="minPrice" label="Min Price">
              <InputNumber
                style={{ width: '100%' }}
                prefix="$"
                min={0}
                step={100000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Minimum price"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="maxPrice" label="Max Price">
              <InputNumber
                style={{ width: '100%' }}
                prefix="$"
                min={0}
                step={100000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Maximum price"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                icon={<FilterOutlined />} 
                htmlType="submit"
              >
                Apply Filters
              </Button>
              <Button 
                icon={<ClearOutlined />} 
                onClick={handleReset}
              >
                Reset Filters
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Text style={{ marginBottom: '16px', display: 'block' }}>
            Found {players.length} players
          </Text>
          <List
            itemLayout="horizontal"
            dataSource={players}
            locale={{ emptyText: "No players available for transfer." }}
            renderItem={player => (
              <List.Item
                actions={[
                  userTeamId !== player.team.id && (
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleBuy(
                        player.id, 
                        player.team.id, 
                        player.askPrice
                      )}
                    >
                      Buy for ${((player.askPrice * 0.95).toFixed(0)).toLocaleString()}
                    </Button>
                  )
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{player.name}</span>
                      <Tag color={
                        player.position === 'GK' ? 'green' :
                        player.position === 'DEF' ? 'blue' :
                        player.position === 'MID' ? 'orange' :
                        'red'
                      }>
                        {player.position}
                      </Tag>
                    </Space>
                  }
                  description={
                    <>
                      <div>Team: {player.team.name}</div>
                      <div>Asking Price: ${player.askPrice.toLocaleString()}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </>
      )}
    </Card>
  );
};

export default TransferMarket;