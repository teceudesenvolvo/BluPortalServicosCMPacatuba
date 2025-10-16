import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Importa o hook de autenticação e a instância do auth
import { useAuth } from '../contexts/FirebaseAuthContext';
import { auth } from '../firebase';

import Brasao from '../assets/logo-pacatuba.png';
import Logo from '../assets/logo-pacatuba-azul.png';

const CadastroPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Se o usuário já estiver logado, redireciona para o dashboard
    if (currentUser) {
        navigate('/dashboard', { replace: true });
        return null;
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error("Erro de cadastro:", err);
            setLoading(false);

            if (err.code === 'auth/email-already-in-use') {
                setError('Este e-mail já está em uso.');
            } else if (err.code === 'auth/invalid-email') {
                setError('O formato do e-mail é inválido.');
            } else if (err.code === 'auth/weak-password') {
                setError('A senha deve ter no mínimo 6 caracteres.');
            } else {
                setError('Ocorreu um erro ao tentar cadastrar. Tente novamente.');
            }
        }
    };

    return (
        <div className="login-container">
            {/* Coluna Esquerda: Informações da Câmara */}
            <div className="login-left-panel">
                <div className="logo-section">
                    <img
                        src={Brasao}
                        alt="Brasão de Pacatuba"
                        className="brasao"
                        style={{ height: '300px', marginTop: '20%' }}
                    />
                </div>
                <p className="developed-by">Desenvolvido por Blu Tecnologias</p>
            </div>

            {/* Coluna Direita: Formulário de Cadastro */}
            <div className="login-right-panel">
                <div className="login-form-box">
                    <img
                        src={Logo}
                        alt="Logo Pacatuba"
                        className="logo-horizontal"
                        style={{ height: '50px', marginBottom: '40px' }}
                    />
                    <div className='div-portal-title'>
                        <p className="portal-title">Crie sua conta</p>
                        <h2 className="portal-subtitle">Portal de Serviços</h2>
                    </div>

                    <form onSubmit={handleRegister}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && <p className="login-error">{error}</p>}

                        <div className="action-buttons">
                            <button
                                type="submit"
                                className="btn-entrar" // Reutilizando a classe
                                disabled={loading}
                            >
                                {loading ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                            <button
                                type="button"
                                className="btn-cadastrar" // Reutilizando a classe
                                onClick={() => navigate('/login')}
                                disabled={loading}
                            >
                                Já tenho conta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CadastroPage;