import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Importa o hook de autenticação e a instância do auth
import { useAuth } from '../contexts/FirebaseAuthContext';
import { auth } from '../firebase';

import Brasao from '../assets/logo-pacatuba.png';
import Logo from '../assets/logo-pacatuba-azul.png';

const LoginPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Monitora o estado atual do usuário

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Efeito para redirecionar se o usuário já estiver logado.
    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard', { replace: true });
        }
    }, [currentUser, navigate]);

    // Evita renderizar o formulário de login se o usuário já estiver logado e o redirecionamento estiver prestes a acontecer.
    if (currentUser) {
        return <div className="loading-full-screen">Redirecionando...</div>; // Ou null
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Chama a função de login do Firebase
            await signInWithEmailAndPassword(auth, email, password);

            // O AuthContext irá detectar a mudança e redirecionar
            // Ou podemos redirecionar explicitamente aqui:
            navigate('/dashboard', { replace: true });

        } catch (err) {
            console.error("Erro de login:", err);
            setLoading(false);

            // Tratamento de erros comuns do Firebase (em Português)
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Credenciais inválidas. Verifique seu e-mail e senha.');
            } else if (err.code === 'auth/invalid-email') {
                setError('O formato do e-mail é inválido.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Acesso temporariamente bloqueado. Tente novamente mais tarde.');
            } else {
                setError('Ocorreu um erro ao tentar logar. Tente novamente.');
            }
        }
    };

    return (
        <div className="login-container">
            {/* Coluna Esquerda: Informações da Câmara */}
            <div className="login-left-panel">
                <div className="logo-section">
                    {/* Substitua pela imagem real do brasão */}
                    <img
                        src={Brasao}
                        alt="Brasão de Pacatuba"
                        className="brasao"
                    />
                </div>
                <p className="developed-by">Desenvolvido por Blu Tecnologias</p>
            </div>

            {/* Coluna Direita: Formulário de Login */}
            <div className="login-right-panel">
                <div className="login-form-box">
                    <img
                        src={Logo}
                        alt="Logo Pacatuba"
                        className="logo-horizontal"
                        style={{ height: '50px', marginBottom: '40px' }}
                    />
                    <div className='div-portal-title'>
                        <p className="portal-title">Seja bem-vindo</p>
                        <h2 className="portal-subtitle">Portal de Serviços</h2>
                    </div>

                    <form onSubmit={handleLogin}>
                        {/* Campo E-mail */}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {/* Campo Senha */}
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Exibe erro, se houver */}
                        {error && <p className="login-error">{error}</p>}

                        {/* Botões */}
                        <div className="action-buttons">
                            <button
                                type="submit"
                                className="btn-entrar"
                                disabled={loading}
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                            <button
                                type="button"
                                className="btn-cadastrar"
                                onClick={() => navigate('/cadastro')}
                                disabled={loading}
                            >
                                Cadastrar
                            </button>
                        </div>
                    </form>

                    <button
                        type="button"
                        className="forgot-password"
                        onClick={() => { /* Implementar recuperação de senha */ }}
                    >
                        Esqueceu a senha?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;