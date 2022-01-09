import './App.css';

import { Route, Routes } from 'react-router-dom';

import AuthProvider from './containers/AuthProvider';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import QuizzesPage from './pages/QuizzesPage';
import React from 'react';
import RequireAuth from './containers/RequiresAuth';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
