import React, { createContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Ability } from "@casl/ability";
import App from "App";

// Material Dashboard 2 PRO React Context Provider
import { MaterialUIControllerProvider, AuthContextProvider } from "context";
import { AbilityContext } from "Can";
import authService from "services/auth-service";
import webStorageClient from "config/webStorageClient";

// Tạo context mới
export const AppContext = createContext({});

const container = document.getElementById("root");
const root = createRoot(container);
const ability = new Ability();

const MainApp = () => {
  // Khởi tạo state cho role và userInfo
  const [role, setRole] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setRole(webStorageClient.getRole() || "");
    setUserInfo(
      webStorageClient.getUser(JSON.stringify(webStorageClient.getUser()) || "")
    );
  }, []);

  return (
    // Sử dụng Provider của AppContext để bọc ngoài toàn bộ ứng dụng
    <AppContext.Provider value={{ role, userInfo }}>
      <BrowserRouter>
        <AuthContextProvider>
          <MaterialUIControllerProvider>
            {/* Truyền ability vào App */}
            <App />
          </MaterialUIControllerProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

root.render(
  <AbilityContext.Provider value={ability}>
    {/* Sử dụng MainApp thay vì App */}
    <MainApp />
  </AbilityContext.Provider>
);
