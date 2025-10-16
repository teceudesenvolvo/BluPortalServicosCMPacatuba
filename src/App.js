import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importa o provedor de autenticação
import { AuthProvider } from './contexts/FirebaseAuthContext';

// Importa as páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login';
import CadastroPage from './pages/Cadastro';

// Páginas Usuário Comum
import Painel from './pages/pagesUser/Painel';
import Procon from './pages/pagesUser/realizarReclamacaoProcon';

function App() {
  return (
    // 1. Envolve toda a aplicação com o AuthProvider
    <AuthProvider>
      <Router>
        <Routes>
          {/* Sem Login */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          <Route path="/dashboard" element={<Painel />} />
          <Route path="/procon" element={<Procon />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;