// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 1. Importa os Provedores

// 2. Importa as Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login';
import CadastroPage from './pages/Cadastro';
// import OuvidoriaPage from './pages/OuvidoriaPage'; // Exemplo de página protegida


// 4. Componente Principal de Roteamento
const AppRoutes = () => {
    return (
        <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            
            {/* Rotas Protegidas (Exemplo) */}
            {/* O acesso a todos os serviços da home page será protegido */}
            
            {/* ... adicione todas as rotas de serviço aqui ... */}
        </Routes>
    );
}


// 5. Configuração Final do App
const App = () => {
  return (
    <Router>
        <AppRoutes />
    </Router>
  );
};

export default App;