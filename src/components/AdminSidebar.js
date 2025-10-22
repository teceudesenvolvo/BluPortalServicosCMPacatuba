import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate,  } from 'react-router-dom';
import Logo from '../assets/logo-pacatuba.png';
import {
    LiaTachometerAltSolid,
    LiaGavelSolid,
    LiaUserFriendsSolid,
    LiaUsersCogSolid,
    LiaUserAstronautSolid,
    LiaFemaleSolid,
    LiaUsersSolid,
    LiaSignOutAltSolid,
    LiaBarsSolid,
    LiaTimesSolid,
} from "react-icons/lia";
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { ref, get } from 'firebase/database';

// --- Componente: Ítem do Menu Lateral (interno ao Sidebar) ---
const AdminSidebarItem = ({ icon, title, path, isActive, onClick }) => (
    <div
        className={`sidebar-item ${isActive ? 'active' : ''}`}
        onClick={() => onClick(path)}
    >
        <span className="sidebar-icon">{icon}</span>
        <span className="sidebar-title">{title}</span>
    </div>
);

// --- Componente Principal: AdminSidebar ---
const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Se o usuário estiver logado, busca o perfil no Realtime Database
                const userRef = ref(db, `users/${user.uid}`);
                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        const userType = userData.tipo || 'Tipo não definido';
                        alert(`Tipo de usuário: ${userType}`);
                    } else {
                        alert('Perfil de usuário não encontrado no banco de dados.');
                    }
                } catch (error) {
                    console.error("Erro ao buscar tipo de usuário:", error);
                    alert('Erro ao buscar tipo de usuário.');
                }
            }
        });
        return () => unsubscribe(); // Limpa o listener ao desmontar o componente
    }, []); // O array vazio faz com que o efeito rode apenas uma vez

    const handleSignOut = async () => {
        if (window.confirm("Tem certeza que deseja sair da conta?")) {
            try {
                await signOut(auth);
                navigate('/login');
            } catch (e) {
                console.error("Erro ao sair:", e);
                alert("Erro ao tentar sair da conta.");
            }
        }
    };

    const menuItems = [
        { title: 'Procon', icon: <LiaTachometerAltSolid />, path: '/admin-procon' },
        { title: 'Atendimentos Jurídicos', icon: <LiaGavelSolid />, path: '/admin-juridico' },
        { title: 'Balcão do Cidadão', icon: <LiaUserFriendsSolid />, path: '/admin-balcao' },
        { title: 'Ouvidoria', icon: <LiaUserAstronautSolid />, path: '/admin-ouvidoria' },
        { title: 'Procuradoria da Mulher', icon: <LiaFemaleSolid />, path: '/admin-procuradoria' },
        { title: 'Solicitações Vereadores', icon: <LiaUsersSolid />, path: '/admin-vereadores' },
        { title: 'Gerenciar Usuários', icon: <LiaUsersCogSolid />, path: '/admin-users' },
    ];

    const handleMobileMenuToggle = () => setMobileMenuOpen(!isMobileMenuOpen);

    const handleItemClick = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <div className="dashboard-sidebar">
            <div className="sidebar-header">
                <img src={Logo} alt="Logo Pacatuba" className="sidebar-logo" style={{ height: '120px', width: 'auto' }} />
                <button className="sidebar-hamburger-btn" onClick={handleMobileMenuToggle}>
                    {isMobileMenuOpen ? <LiaTimesSolid size={24} /> : <LiaBarsSolid size={24} />}
                </button>
            </div>

            <div className={`sidebar-menu ${isMobileMenuOpen ? 'is-open' : ''}`}>
                {menuItems.map((item) => (
                    <AdminSidebarItem
                        key={item.title}
                        icon={item.icon}
                        title={item.title}
                        path={item.path}
                        isActive={location.pathname === item.path}
                        onClick={handleItemClick}
                    />
                ))}
                {/* Botão de Sair */}
                <div className="sidebar-item" onClick={handleSignOut}>
                    <span className="sidebar-icon"><LiaSignOutAltSolid /></span>
                    <span className="sidebar-title">Sair</span>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;