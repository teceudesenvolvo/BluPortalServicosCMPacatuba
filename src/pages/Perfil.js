import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Importações do Firebase
import { ref, get } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/FirebaseAuthContext';
import { auth, db } from '../firebase';
import Sidebar from '../components/Sidebar';

// Ícones
import {
    LiaUser, LiaLongArrowAltUpSolid, LiaLockSolid
} from "react-icons/lia";

// *******************
// Componente Principal: Perfil
// *******************
const Perfil = () => {
    const navigate = useNavigate();
    const { currentUser: userAuth, loading: loadingAuth } = useAuth();

    // ESTADOS LOCAIS
    const [profileData, setProfileData] = useState(null); // Dados do Perfil Firestore
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [error, setError] = useState(null);

    // 2. BUSCA E OBSERVAÇÃO DE DADOS DO PERFIL
    const fetchProfileData = useCallback(async () => {
        if (loadingAuth || !userAuth) {
            if (!loadingAuth && !userAuth) navigate('/login');
            return;
        }

        setLoadingProfile(true);
        setError(null);
        
        const userId = userAuth.uid;
        const userRef = ref(db, 'users/' + userId);
        
        try {
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
                // Se os dados existirem, carregue-os
                const userData = snapshot.val();
                setProfileData({
                    uid: userId,
                    nome: userData.nome || userAuth.displayName || 'Usuário',
                    email: userAuth.email,
                    tipo: userData.tipo || 'Cidadão',
                    ...userData // Adiciona outros campos do perfil
                });
            } else {
                // Caso contrário, use dados básicos do Auth
                setProfileData({ uid: userId, nome: userAuth.displayName || 'Usuário', email: userAuth.email, tipo: 'Cidadão' });
                console.warn("Documento de perfil não encontrado no Realtime Database.");
            }
        } catch (error) {
            console.error("Erro ao buscar/criar dados do perfil:", error);
            setError("Erro ao carregar os dados do perfil. Verifique as permissões.");
        } finally {
            setLoadingProfile(false);
        }
    }, [userAuth, loadingAuth, navigate]);

    // Dispara a busca quando db e userAuth estiverem prontos
    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);


    // Funções de Ação (Apenas logs no mock)
    const handleEdit = () => {
        // Alerta simples em vez de confirm() ou alert() nativo
        console.log("Função 'Editar' ativada! (Em um app real, abriria um formulário de edição)");
        window.confirm("Função 'Editar' ativada! (Em um app real, abriria um formulário de edição)");
    };

    const handlePasswordChange = () => {
        console.log("Função 'Alterar Senha' ativada! (Em um app real, abriria um modal de alteração)");
        window.confirm("Função 'Alterar Senha' ativada! (Em um app real, abriria um modal de alteração)");
    };

    const handleSignOut = async () => {
        try {
            // Exibe uma confirmação antes de sair (usando o nativo window.confirm)
            if (window.confirm("Tem certeza que deseja sair da conta?")) {
                await signOut(auth);
                // O AuthProvider irá detectar a mudança e o App redirecionará
                navigate('/login');
            }
        } catch (e) {
            console.error("Erro ao sair:", e);
            alert("Erro ao tentar sair da conta.");
        }
    };

    // Navegação Sidebar (Apenas log no mock)
    const handleNavigation = (path) => {
        navigate(path);
    };

    // *******************
    // Renderização Condicional
    // *******************
    if (loadingAuth || loadingProfile) {
        return <div className="loading-full-screen">Carregando perfil...</div>;
    }

    if (error || !profileData) {
        return (
            <div className="loading-full-screen">
                <div className="error-message">
                    <h1>Erro ao Carregar Perfil</h1>
                    <p>{error || "Dados de perfil não disponíveis."}</p>
                </div>
            </div>
        );
    }
    
    // Desestruturação dos dados para fácil acesso
    const { 
        name, email, phone, cpf, estadoCivil, sexo,
        cep, address, numero, complemento, neighborhood, city, state, tipo 
    } = profileData;

    // Renderização do Perfil
    return (
        <div className="dashboard-layout">
            <Sidebar onItemClick={handleNavigation} />
            <div className="dashboard-content">
                
                <header className="content-header">
                    <div className="header-title-section">
                        {/* Aqui pode ir a logo da Pacatuba */}
                        <h1>Câmara Municipal de Pacatuba</h1>
                        <p>Portal de Serviços</p>
                    </div>
                </header>

                <div className="profile-container">
                    
                    {/* Sumário do Perfil */}
                    <div className="profile-summary">
                        <div className="profile-info">
                            <div className="profile-avatar">
                                <LiaUser /> {/* Ícone de usuário */}
                            </div>
                            <div className="profile-text">
                                {/* Exibe o Tipo de Usuário (ex: Administrador) e depois o email */}
                                <h2>{tipo || name}</h2>
                                <p>{email}</p>
                            </div>
                        </div>
                        <button className="btn-edit" onClick={handleEdit}>
                            Editar
                        </button>
                    </div>

                    {/* Dados Detalhados */}
                    <div className="data-sections-grid">
                        
                        {/* Seção Dados Pessoais */}
                        <div className="data-card">
                            <div className="card-header">
                                <h3>Dados Pessoais</h3>
                            </div>
                            
                            <div className="data-item">
                                <strong>Nome:</strong>
                                <span>{name || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>Email:</strong>
                                <span>{email || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>Telefone:</strong>
                                <span>{phone || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>CPF:</strong>
                                <span>{cpf || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>Estado Civil:</strong>
                                <span>{estadoCivil || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>Sexo:</strong>
                                <span>{sexo || 'N/A'}</span>
                            </div>
                        </div>
                        
                        {/* Seção Endereço */}
                        <div className="data-card">
                            <div className="card-header">
                                <h3>Endereço</h3>
                            </div>
                            
                            <div className="data-item">
                                <strong>CEP:</strong>
                                <span>{cep || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>Endereço:</strong>
                                <span>{address || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>Número:</strong>
                                <span>{numero || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>Complemento:</strong>
                                <span>{complemento || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>Bairro:</strong>
                                <span>{neighborhood || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>Cidade:</strong>
                                <span>{city || 'N/A'}</span>
                            </div>
                            <div className="data-item">
                                <strong>UF:</strong>
                                <span>{state || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ações do Perfil */}
                    <div className="profile-actions">
                        <button className="btn-alter-pass" onClick={handlePasswordChange}>
                            <LiaLockSolid size={18} style={{ marginRight: '8px' }} />
                            Alterar Senha
                        </button>
                        <button className="btn-danger" onClick={handleSignOut}>
                            <LiaLongArrowAltUpSolid size={18} style={{ marginRight: '8px' }} />
                            Sair da conta
                        </button>
                    </div>

                </div>

                <footer style={{ marginTop: '50px', textAlign: 'center', fontSize: '0.8rem', color: '#9ca3af' }}>
                    Desenvolvido por Blu Tecnologias
                </footer>
            </div>
        </div>
    );
};

export default Perfil;
