import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/FirebaseAuthContext'; // Para obter dados do usuário
import Sidebar from '../../components/Sidebar'; 
import {
    
    LiaBookOpenSolid,
    LiaBalanceScaleLeftSolid,
    LiaUserFriendsSolid,
    LiaUserAstronautSolid,
    LiaFemaleSolid,
    LiaUsersSolid,
} from "react-icons/lia";

// --- Componente: Card de Serviço no Grid ---
const ServiceCard = ({ icon, title, path, navigate }) => {
    return (
        <div 
            className="service-card-dashboard" 
            onClick={() => navigate(path)}
        >
            <span className="card-icon-dashboard">{icon}</span>
            <p className="card-title-dashboard">{title}</p>
        </div>
    );
};

// --- Componente Principal: DashboardPage ---
const DashboardPage = () => {
    const navigate = useNavigate(); 
    const { currentUser: user, loading } = useAuth(); // Corrigido: usa currentUser e o renomeia para user

    // Dados do Usuário
    const userName = user?.name || user?.email || 'Cidadão';
    const userType = 'Cidadão'; // Pode ser buscado no Firestore

    // 2. Dados do Grid de Serviços (Principais)
    // O ideal é que o path reflita o ítem do menu lateral
    const serviceGridItems = [
        { title: 'Procon', icon: <LiaBookOpenSolid />, path: '/procon-atendimentos' },
        { title: 'Atendimento Jurídico', icon: <LiaBalanceScaleLeftSolid />, path: '/juridico' },
        { title: 'Balcão do Cidadão', icon: <LiaUserFriendsSolid />, path: '/balcao' },
        { title: 'Ouvidoria', icon: <LiaUserAstronautSolid />, path: '/ouvidoria' },
        { title: 'Vereadores', icon: <LiaUsersSolid />, path: '/vereadorestodos' },
        { title: 'Procuradoria da Mulher', icon: <LiaFemaleSolid />, path: '/procuradoria' },
        // Pode adicionar mais se necessário
    ];

    // Simulação da função de Logout (para um botão que você pode adicionar depois)
    
    
    // Handler para navegação do menu lateral
    const handleMenuItemClick = (path) => {
        navigate(path);

    };

    if (loading) {
        return <div className="loading-full-screen">Carregando Dashboard...</div>;
    }

    // Se a rota for protegida (ProtectedRoute no App.js), não é necessário 
    // verificar o usuário aqui, mas é uma boa prática.
    if (!user) {
         return null; // O ProtectedRoute já redirecionou para /login
    }

    return (
        <div className="dashboard-layout">
            
            {/* 1. Sidebar Fixo */}
            <Sidebar onItemClick={handleMenuItemClick} />

            {/* 2. Conteúdo Principal */}
            <div className="dashboard-content">
                <header className="content-header">
                    <div className="header-info">
                        <p className="header-title-main">Câmara Municipal de Pacatuba</p>
                        <h1 className="header-subtitle-main">Portal de Serviços</h1>
                    </div>
                    
                    <div className="user-profile">
                        <div className="user-text">
                            <p className="user-name-display">{userName}</p>
                            <p className="user-type-display">{userType}</p>
                        </div>
                        <div className="user-avatar"></div> {/* Círculo Azul */}
                    </div>
                </header>

                <main className="services-grid-main">
                    {serviceGridItems.map((item) => (
                        <ServiceCard 
                            key={item.title}
                            icon={item.icon}
                            title={item.title}
                            path={item.path}
                            navigate={navigate}
                        />
                    ))}
                </main>
                
                <footer className="dashboard-footer">
                     Desenvolvido por Blu Tecnologias
                </footer>
            </div>
        </div>
    );
};

export default DashboardPage;