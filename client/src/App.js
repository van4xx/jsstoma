import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* All authenticated routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/*" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App; 