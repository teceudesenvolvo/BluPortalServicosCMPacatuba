import React from 'react';
import { useLocation } from 'react-router-dom';
import Logo from '../assets/logo-pacatuba.png';
import {
    LiaHomeSolid,
    LiaBookOpenSolid,
    LiaBalanceScaleLeftSolid,
    LiaUserFriendsSolid,
    LiaUserAstronautSolid,
    LiaFemaleSolid,
    LiaUsersSolid,
    LiaUser,
} from "react-icons/lia";

// --- Componente: Ítem do Menu Lateral (interno ao Sidebar) ---
const SidebarItem = ({ icon, title, path, isActive, onClick }) => (
    <div
        className={`sidebar-item ${isActive ? 'active' : ''}`} // A lógica de 'active' agora é interna
        onClick={() => onClick(path)}
    >
        <span className="sidebar-icon">{icon}</span>
        <span className="sidebar-title">{title}</span>
    </div>
);

// --- Componente Principal: Sidebar ---
const Sidebar = ({ onItemClick }) => {
    const location = useLocation(); // Hook para obter a rota atual

    // Itens do menu agora são definidos diretamente aqui
    const menuItems = [
        { title: 'Início', icon: <LiaHomeSolid />, path: '/dashboard' },
        { title: 'Procon', icon: <LiaBookOpenSolid />, path: '/procon-atendimentos' },
        { title: 'Atendimento Jurídico', icon: <LiaBalanceScaleLeftSolid />, path: '/juridico' },
        { title: 'Balcão do Cidadão', icon: <LiaUserFriendsSolid />, path: '/balcao' },
        { title: 'Ouvidoria', icon: <LiaUserAstronautSolid />, path: '/ouvidoria' },
        { title: 'Procuradoria da Mulher', icon: <LiaFemaleSolid />, path: '/procuradoria' },
        { title: 'Vereadores', icon: <LiaUsersSolid />, path: '/vereadorestodos' },
        { title: 'Perfil', icon: <LiaUser />, path: '/perfil' },
    ];

    return (
        <div className="dashboard-sidebar">
            <div className="sidebar-header">
                <img
                    src={Logo}
                    alt="Logo Pecatuba"
                    className="sidebar-logo"
                    style={{ height: '120px', width: 'auto' }}
                />
            </div>

            <div className="sidebar-menu">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.title} // A chave continua sendo o título
                        icon={item.icon}
                        title={item.title}
                        path={item.path}
                        isActive={location.pathname === item.path} // Determina se o item está ativo
                        onClick={onItemClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;