import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';

// Componente: Card do Vereador (agora parte deste módulo)
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
                const response = await fetch('/api/dadosabertosexportar?d=vereadores&a=&f=json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
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

    const splideOptions = {
        type: 'slide',
        perPage: 4,
        gap: '2rem',
        padding: '1rem',
        arrows: true,
        pagination: false,
        breakpoints: {
            1024: { perPage: 3 },
            768: { perPage: 2, gap: '1rem' },
            480: { perPage: 1 },
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

export default VereadoresSlider;