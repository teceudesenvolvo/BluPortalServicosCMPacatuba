import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importa o provedor de autenticação
import { AuthProvider } from './contexts/FirebaseAuthContext';

// Importa as páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login';
import CadastroPage from './pages/Cadastro';
import Perfil from './pages/Perfil';

// Páginas Usuário Comum
import Painel from './pages/pagesUser/Painel';
import Procon from './pages/pagesUser/realizarReclamacaoProcon';
import ProconAtendimentos from './pages/pagesUser/ProconAtendimentos';
import AtendimentoJuridico from './pages/pagesUser/AtendimentoJuridico';
import NovoAtendimentoJuridico from './pages/pagesUser/NovoAtendimentoJuridico';

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
          <Route path="/perfil" element={<Perfil />} />

          <Route path="/dashboard" element={<Painel />} />
          <Route path="/procon" element={<Procon />} />
          <Route path="/procon-atendimentos" element={<ProconAtendimentos />} />
          <Route path="/juridico" element={<AtendimentoJuridico />} />
          <Route path="/juridico/novo" element={<NovoAtendimentoJuridico />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;