import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import DashboardLayout from './layouts/DashboardLayout';
import PostList from './pages/posts/PostList';
import UserList from './pages/users/UserList';
import Login from './pages/auth/Login';
import RecipeDetail from './pages/recipes/RecipeDetail';
import RecipeList from './pages/recipes/RecipeList';

// Tạo theme mặc định
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/posts" replace />} />
            <Route path="posts" element={<PostList />} />
            <Route path="users" element={<UserList />} />
            <Route path="recipes/:id" element={<RecipeDetail />} />
            <Route path="recipes" element={<RecipeList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
