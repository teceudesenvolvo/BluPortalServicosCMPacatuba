import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importa o provedor de autenticação
import { AuthProvider } from './contexts/FirebaseAuthContext';

// Importa as páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login';

function App() {
  return (
    // 1. Envolve toda a aplicação com o AuthProvider
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Adicione outras rotas aqui, como /cadastro ou /dashboard */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;