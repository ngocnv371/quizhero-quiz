import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import AuthProvider from "./containers/AuthProvider";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import QuizzesPage from "./pages/QuizzesPage";
import React from "react";
import RequireAuth from "./containers/RequiresAuth";

const theme = createTheme();

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <QuizzesPage />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
