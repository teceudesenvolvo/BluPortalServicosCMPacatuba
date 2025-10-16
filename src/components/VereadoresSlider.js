import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import axios from 'axios'; // 1. Importa o axios

// Componente: Card do Vereador (agora parte deste módulo)
const VereadorCard = ({ nome, nomeParlamentar, foto }) => (
    <div className="vereador-card">
        <div className="vereador-foto-container">
            <img src={foto} alt={`Foto de ${nome}`} className="vereador-foto" />
        </div>
        <div className="vereador-info">
            <p className="vereador-nome">{nome}</p>
            <p className="vereador-titulo">{nomeParlamentar}</p>
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
                // 2. Usa axios com o caminho relativo do proxy para evitar erros de CORS
                const response = await axios.get('/api/dadosabertosexportar?d=vereadores&a=&f=json&itens_por_pagina=20');
                // 3. Axios já retorna os dados em `response.data`
                // A API retorna um array diretamente, não um objeto com a chave 'dados'.
                setVereadores(response.data || []);
            } catch (err) {
                // 4. Axios trata erros de status (4xx, 5xx) automaticamente no catch
                setError('Falha ao carregar os dados dos vereadores.');
                console.error("Erro ao buscar com axios:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVereadores();
    }, []); // Setter functions from useState are stable and don't need to be in the dependency array.

    if (loading) {
        return <div className="loading-text">Carregando vereadores...</div>;
    }

    if (error) {
        return <div className="error-text">{error}</div>;
    }

    const splideOptions = {
        type: 'slide',
        perPage: 5,
        gap: '0.5%',
        padding: '2rem',
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
            <h3 className="section-title-vereadores">Nossos Vereadores</h3>
            {vereadores && Array.isArray(vereadores) && vereadores.length > 0 && (
            <Splide options={splideOptions}>  
                {vereadores.map((v, index) => (
                    <SplideSlide key={index}>
                        <VereadorCard
                            nome={v.NomeParlamentar} // Passa a propriedade 'Nome' da API
                            nomeParlamentar={v.Cargo} // Passa a propriedade 'NomeParlamentar'
                            foto={v.Foto} // Passa a propriedade 'Foto'
                        />
                    </SplideSlide>
                ))}
            </Splide>
            )}
        </div>
    );
};

export default VereadoresSlider;