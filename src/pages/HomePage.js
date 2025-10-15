import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';

// URL para buscar os vereadores (usando o proxy de desenvolvimento)

// Componente: Item do Serviço (Todos vão para o Login)
const ServiceButton = ({ icon, title, navigate }) => {
    return (
        <button
            className="service-btn"
            onClick={() => navigate('/login')}
        >
            <div className="service-icon">{icon}</div>
            <p className="service-title">{title}</p>
        </button>
    );
};

// Componente: Card do Vereador
const VereadorCard = ({ nome, titulo, foto }) => (
    <div className="vereador-card">
        <div className="vereador-foto-container">
            <img src={foto} alt={`Foto de ${nome}`} className="vereador-foto" />
        </div>
        <div className="vereador-info">
            <p className="vereador-nome">{nome}</p>
            <p className="vereador-titulo">{titulo}</p>
        </div>
    </div>
);

// Componente: Slider dos Vereadores
const VereadoresSlider = () => {
    const [vereadores, setVereadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVereadores = async () => {
            try {
                // Usamos o caminho relativo para acionar o proxy configurado em setupProxy.js
                const response = await fetch('https://www.cmpacatuba.ce.gov.br/dadosabertosexportar?d=vereadores&a=&f=json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // A API retorna um objeto { dados: [...] }
                setVereadores(data.dados || []);
            } catch (e) {
                console.error("Falha ao buscar vereadores:", e);
                setError("Não foi possível carregar os dados dos vereadores.");
            } finally {
                setLoading(false);
            }
        };

        fetchVereadores();
    }, []);

    if (loading) {
        return <div className="loading-text">Carregando vereadores...</div>;
    }

    if (error) {
        return <div className="error-text">{error}</div>;
    }

    // Configurações do Splide
    const splideOptions = {
        type: 'slide',
        perPage: 4, // 4 cards visíveis no desktop
        gap: '2rem',
        padding: '1rem',
        arrows: true,
        pagination: false,
        breakpoints: {
            1024: {
                perPage: 3,
            },
            768: {
                perPage: 2,
                gap: '1rem',
            },
            480: {
                perPage: 1,
            },
        },
    };

    return (
        <div className="vereadores-section">
            <h3 className="section-title">Nossos Vereadores</h3>
            <Splide options={splideOptions}>
                {vereadores.map((v, index) => (
                    <SplideSlide key={index}>
                        <VereadorCard
                            nome={v.vereador_nome}
                            titulo={v.vereador_titulo}
                            foto={v.vereador_foto}
                        />
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    );
};

// Componente: Rodapé
const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-logo">
                <img src="/logo-pecatuba-white.png" alt="Pecatuba" style={{ height: '50px' }} />
                <p>Pacatuba</p>
            </div>

            <div className="footer-contact">
                <h4>Contato</h4>
                <p>
                    **Endereço:** Avenida Prefeito Maurício Brasileiro, Av. Cel. Neco Martins - Liberdade, São Gonçalo do Amarante - CE, 62870-000
                </p>
                <p>**Telefone:** (85) 3315-4482</p>
                <p>**Email:** procon@cmsga.ce.gov.br</p>
            </div>

            <div className="footer-links">
                <h4>Nossos Serviços</h4>
                <ul>
                    <li>Registrar Reclamação</li>
                    <li>Solicitar Serviços</li>
                    <li>Criar uma Conta</li>
                </ul>
                <h4>Informações Úteis</h4>
                <ul>
                    <li>Códigos de Defesa do Consumidor</li>
                    <li>Plataforma Consumidor.gov</li>
                </ul>
            </div>

            <div className="footer-app-links">
                <div className="qr-code">
                    <img src="https://i.imgur.com/rMhDq6o.png" alt="QR Code" style={{ height: '100px' }} />
                </div>
                <div className="app-badges">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Available_on_the_App_Store_%28black%29.png" alt="App Store" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>
                Copyright © 2025 Procon CMSGA. Todos os direitos reservados.
                Desenvolvido por Blu Tecnologias.
            </p>
        </div>
    </footer>
);

// Componente Principal: Home Page
const HomePage = () => {
    const navigate = useNavigate();

    // Simulação dos ícones dos serviços (Usando Unicode ou Font Icons)
    const icons = {
        procon: '🛒',
        juridico: '⚖️',
        balcao: '🧑‍💼',
        ouvidoria: '🗣️',
        procuradoria: '👩‍⚖️',
        vereadores: '🏛️',
    };

    return (
        <div className="home-page">
            
            {/* 1. Header Principal */}
            <header className="main-header">
                <div className="header-overlay">
                    <h1 className="header-title">Bem vindo ao Portal de Serviços</h1>
                    <p className="header-subtitle">Seu acesso fácil e rápido ao Poder Legislativo Municipal.</p>
                    <div className="header-actions">
                        <button className="btn-primary" onClick={() => navigate('/login')}>Entrar</button>
                        <button className="btn-secondary" onClick={() => navigate('/cadastro')}>Cadastrar</button>
                    </div>
                </div>
            </header>

            {/* 2. Seção de Serviços */}
            <section className="services-grid-section">
                <div className="services-grid">
                    <ServiceButton icon={icons.procon} title="Procon" navigate={navigate} />
                    <ServiceButton icon={icons.juridico} title="Atendimento Jurídico" navigate={navigate} />
                    <ServiceButton icon={icons.balcao} title="Balcão do Cidadão" navigate={navigate} />
                    <ServiceButton icon={icons.ouvidoria} title="Ouvidoria" navigate={navigate} />
                    <ServiceButton icon={icons.procuradoria} title="Procuradoria da Mulher" navigate={navigate} />
                    {/* O botão "Vereadores" da grade vai para Login, mas o slider abaixo é para informações abertas */}
                    <ServiceButton icon={icons.vereadores} title="Vereadores" navigate={navigate} /> 
                </div>
            </section>

            {/* 3. Slider de Vereadores (Com dados da API) */}
            <section className="vereadores-slider-section">
                <VereadoresSlider />
            </section>

            {/* 4. Rodapé */}
            <Footer />
        </div>
    );
};

export default HomePage;