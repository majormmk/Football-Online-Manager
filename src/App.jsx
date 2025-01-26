import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Layout, Menu, Button, message } from "antd";
import { ShopOutlined, TeamOutlined, LogoutOutlined } from "@ant-design/icons";
import Auth from "./pages/Auth";
import TransferMarket from "./pages/TransferMarket";
import MyTeam from "./pages/MyTeam";

const { Header, Content } = Layout;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userTeam, setUserTeam] = useState(localStorage.getItem("teamId"));

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    message.success('Logged out successfully');
  };

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ padding: 0 }}>
          {token ? (
            <Menu theme="dark" mode="horizontal">
              <Menu.Item key="market" icon={<ShopOutlined />}>
                <a href="/transfer-market">Transfer Market</a>
              </Menu.Item>
              <Menu.Item key="team" icon={<TeamOutlined />}>
                <a href="/my-team">My Team</a>
              </Menu.Item>
              <Menu.Item key="logout" style={{ marginLeft: 'auto' }}>
                <Button 
                  type="text" 
                  icon={<LogoutOutlined />} 
                  onClick={handleLogout}
                  style={{ color: 'white' }}
                >
                  Logout
                </Button>
              </Menu.Item>
            </Menu>
          ) : (
            <Menu theme="dark" mode="horizontal">
              <Menu.Item key="auth">
                <a href="/auth">Login</a>
              </Menu.Item>
            </Menu>
          )}
        </Header>
        <Content style={{ padding: '24px' }}>
          <Routes>
            <Route
              path="/auth"
              element={<Auth setToken={setToken} setUserTeam={setUserTeam} />}
            />
            {token ? (
              <>
                <Route
                  path="/transfer-market"
                  element={<TransferMarket token={token} userTeamId={userTeam} />}
                />
                <Route
                  path="/my-team"
                  element={<MyTeam token={token} userTeamId={userTeam} />}
                />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/auth" />} />
            )}
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;