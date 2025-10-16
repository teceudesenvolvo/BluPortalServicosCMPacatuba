import React from 'react';
import Logo from '../assets/logo-pacatuba.png';

// --- Componente: Ítem do Menu Lateral (interno ao Sidebar) ---
const SidebarItem = ({ icon, title, path, isActive, onClick }) => (
    <div
        className={`sidebar-item ${isActive ? 'active' : ''}`}
        onClick={() => onClick(path)}
    >
        <span className="sidebar-icon">{icon}</span>
        <span className="sidebar-title">{title}</span>
    </div>
);

// --- Componente Principal: Sidebar ---
const Sidebar = ({ menuItems, onItemClick }) => {
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
                        key={item.title}
                        {...item} // Passa todas as propriedades do item (icon, title, path, isActive)
                        onClick={onItemClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;