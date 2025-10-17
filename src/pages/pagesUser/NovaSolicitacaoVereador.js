import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/FirebaseAuthContext';
import Sidebar from '../../components/Sidebar';
import { db } from '../../firebase';
import { ref, get, push, set, serverTimestamp } from 'firebase/database';
import axios from 'axios';

// Ícones
import { LiaPaperPlane, LiaArrowLeftSolid } from "react-icons/lia";

const NovaSolicitacaoVereador = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [vereadores, setVereadores] = useState([]);
    const [formData, setFormData] = useState({
        vereadorId: '',
        vereadorNome: '',
        assunto: '',
        tipoAtendimento: 'Presencial',
        dataPreferencial: '',
        horarioPreferencial: 'Manhã',
        descricao: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loggedInUserData, setLoggedInUserData] = useState(null);

    // Busca a lista de vereadores da API
    useEffect(() => {
        const fetchVereadores = async () => {
            try {
                const response = await axios.get('/api/dadosabertosexportar?d=vereadores&a=&f=json&itens_por_pagina=20');
                // A API do proxy retorna o array diretamente em response.data
                if (Array.isArray(response.data)) {
                    setVereadores(response.data);
                }
            } catch (err) {
                setError('Falha ao carregar a lista de vereadores.');
                console.error("Erro ao buscar vereadores:", err);
            }
        };
        fetchVereadores();
    }, []);

    const fetchUserProfile = useCallback(async () => {
        if (!currentUser) return;
        const userRef = ref(db, 'users/' + currentUser.uid);
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                setLoggedInUserData(snapshot.val());
            }
        } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            fetchUserProfile();
        }
    }, [currentUser, navigate, fetchUserProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'vereadorId') {
            const vereadorSelecionado = vereadores.find(v => v.Id === value);
            setFormData(prevData => ({
                ...prevData,
                vereadorId: value,
                vereadorNome: vereadorSelecionado ? vereadorSelecionado.Nome : ''
            }));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.vereadorId || !formData.assunto || !formData.descricao) {
            setError('Por favor, selecione um vereador e preencha os campos de Assunto e Descrição.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const dadosUsuarioParaSalvar = {
                id: currentUser.uid,
                email: loggedInUserData?.email || currentUser.email,
                name: loggedInUserData?.name || 'Não informado',
                phone: loggedInUserData?.phone || 'Não informado',
                address: loggedInUserData?.address || 'Não informado',
                neighborhood: loggedInUserData?.neighborhood || 'Não informado',
                city: loggedInUserData?.city || 'Não informado',
            };

            const novaSolicitacaoRef = push(ref(db, 'solicitacoes-vereadores'));

            await set(novaSolicitacaoRef, {
                dadosSolicitacao: formData,
                dadosUsuario: dadosUsuarioParaSalvar,
                userId: currentUser.uid,
                status: 'Aguardando Confirmação',
                dataSolicitacao: serverTimestamp(),
            });

            setSuccess('Sua solicitação de atendimento foi enviada com sucesso! Você será redirecionado em breve.');
            setTimeout(() => navigate('/vereadores'), 3000);
        } catch (err) {
            console.error("Erro ao enviar solicitação:", err);
            setError('Ocorreu um erro ao enviar sua solicitação. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar onItemClick={(path) => navigate(path)} />
            <div className="dashboard-content">
                <header className="page-header-container">
                    <div className="header-title-section">
                        <h1>Câmara Municipal de Pacatuba</h1>
                        <p>Solicitar Atendimento com Vereador</p>
                    </div>
                    <div className="user-profile">
                        <div className="user-text">
                            <p className="user-name-display">{loggedInUserData?.name || currentUser?.email}</p>
                            <p className="user-type-display">{loggedInUserData?.tipo || 'Cidadão'}</p>
                        </div>
                        <div className="user-avatar"></div>
                    </div>
                </header>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <h3 className="form-section-title">Formulário de Solicitação</h3>

                        <div className="form-group">
                            <label htmlFor="vereadorId">Vereador(a) *</label>
                            <select id="vereadorId" name="vereadorId" value={formData.vereadorId} onChange={handleChange} required>
                                <option value="">Selecione um(a) vereador(a)</option>
                                {vereadores.map(v => (
                                    <option key={v.Id} value={v.Id}>{v.Nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="assunto">Assunto *</label>
                            <input type="text" id="assunto" name="assunto" value={formData.assunto} onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="dataPreferencial">Data Preferencial</label>
                                <input type="date" id="dataPreferencial" name="dataPreferencial" value={formData.dataPreferencial} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="horarioPreferencial">Horário Preferencial</label>
                                <select id="horarioPreferencial" name="horarioPreferencial" value={formData.horarioPreferencial} onChange={handleChange}>
                                    <option value="Manhã">Manhã (08:00 - 12:00)</option>
                                    <option value="Tarde">Tarde (13:00 - 17:00)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="descricao">Descrição da sua solicitação *</label>
                            <textarea id="descricao" name="descricao" rows="6" value={formData.descricao} onChange={handleChange} required></textarea>
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate('/vereadores')}>
                                <LiaArrowLeftSolid size={18} style={{ marginRight: '8px' }} />
                                Voltar
                            </button>
                            <button type="submit" className="btn-submit" disabled={loading}>
                                <LiaPaperPlane size={18} style={{ marginRight: '8px' }} />
                                {loading ? 'Enviando...' : 'Enviar Solicitação'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NovaSolicitacaoVereador;