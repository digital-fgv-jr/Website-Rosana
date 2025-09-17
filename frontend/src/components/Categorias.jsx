import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategorias } from "../api/services/categoriaService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Importação dos estilos do Swiper
import "swiper/css";
import "swiper/css/navigation";

// Componente para um item individual da categoria
const CategoriaItem = ({ cat }) => {
    const navigate = useNavigate();
    // Cria um "slug" amigável para a URL a partir do nome da categoria
    const slug = cat.nome_categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return (
        <div
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => navigate(`/joias?categoria=${slug}`)}
        >
            <div className="w-full max-w-[280px] aspect-square bg-[#faf9f6] overflow-hidden group-hover:scale-105 transition-transform duration-300 rounded-lg">
                <img
                    src={cat.primeira_imagem} // Imagem vinda da API
                    alt={cat.nome_categoria}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
            <p className="mt-4 font-BodoniMT text-[#1c2c3c] text-[clamp(1.8rem,2.2vw,2.5rem)]">
                {cat.nome_categoria}
            </p>
        </div>
    );
};

// Componente principal do carrossel de categorias
export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await getCategorias();
                const categoriasFiltradas = response.data.filter(c => c.slug !== 'todos');
                setCategorias(categoriasFiltradas);
            } catch (error) {
                console.error("Erro ao buscar as categorias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategorias();
    }, []);

    if (loading) {
        return <section className="w-full px-6 py-12 bg-[#faf9f6] text-center"><p>Carregando categorias...</p></section>;
    }
    
    if (!categorias || categorias.length === 0) {
        return null;
    }

    return (
        <section className="w-full px-6 py-12 bg-[#faf9f6]">
            {/* O contêiner pai do Swiper agora tem a largura máxima e o Swiper dentro dele tem 100% */}
            <div className="relative w-[90%] max-w-[1152px] mx-auto">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                      nextEl: '.swiper-button-next-custom',
                      prevEl: '.swiper-button-prev-custom',
                    }}
                    loop={true}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        768: { slidesPerView: 3, spaceBetween: 30 },
                        1024: { slidesPerView: 4, spaceBetween: 40 },
                        1280: { slidesPerView: 5, spaceBetween: 40 },
                    }}
                    className="categorias-carousel h-full w-full" /* Swiper com 100% de largura dentro do pai */
                >
                    {categorias.map((cat) => (
                        <SwiperSlide key={cat.id}>
                            <CategoriaItem cat={cat} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* Adicionando os botões de navegação customizados FORA do Swiper, mas DENTRO do contêiner mx-auto */}
                <div className="swiper-button-prev-custom custom-nav-button left-0 transform -translate-x-full md:-translate-x-1/2"></div>
                <div className="swiper-button-next-custom custom-nav-button right-0 transform translate-x-full md:translate-x-1/2"></div>
            </div>
        </section>
    );
}