<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";

const db = getFirestore();
const storage = getStorage();

const CACHE_KEY = 'church_hero_cache';
const CACHE_TIME = 1000 * 60 * 60 * 4;

const location = 'hero';
const page = 'home';

const images = ref([]); 
const currentSlide = ref(1);
const isMobile = ref(window.innerWidth <= 768);
const isLoading = ref(true); // Estado inicial de carregamento
let sliderInterval = null;

const checkScreenSize = () => {
    isMobile.value = window.innerWidth <= 768;
};

const renderImages = (allImages) => {
    const filterFormat = isMobile.value ? 'mobile' : 'desktop';
    const filtered = allImages.filter(img => img.format === filterFormat);
    
    images.value = filtered.length > 0 ? filtered : allImages;
    
    // Desativa o skeleton apenas se houver imagens ou após tentar carregar
    isLoading.value = false;
    
    if (images.value.length > 0) startSlider();
};

async function loadHeroImages() {
    isLoading.value = true;

    // 1. Tenta Cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TIME) {
            renderImages(data);
            return;
        }
    }

    // 2. Busca no Firebase
    try {
        const today = new Date().toISOString().split('T')[0];
        const q = query(
            collection(db, "images"),
            where("page", "==", page),
            where("location", "==", location),
            where("status", "==", "active")
            // Removi o 'where expired_at' pois o Firebase exige índice composto. 
            // Filtraremos manualmente abaixo para evitar erros iniciais.
        );

        const querySnapshot = await getDocs(q);
        const fetchedImages = [];

        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data();
            
            // Filtro manual de expiração (Seguro e economiza índices)
            if (data.expired_at && data.expired_at < today) continue;

            try {
                const fileRef = storageRef(storage, `images/${data.name}`);
                const url = await getDownloadURL(fileRef);
                
                fetchedImages.push({
                    src: url,
                    alt: data.alt || 'Church Image',
                    format: data.format
                });
            } catch (err) {
                console.warn(`Arquivo não encontrado: ${data.name}`);
            }
        }

        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: fetchedImages
        }));

        renderImages(fetchedImages);

    } catch (error) {
        console.error("Erro ao carregar:", error);
        isLoading.value = false;
    }
}

const startSlider = () => {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        if (images.value.length > 0) {
            currentSlide.value = (currentSlide.value % images.value.length) + 1;
        }
    }, 5000);
};

const setSlide = (index) => {
    currentSlide.value = index;
};

onMounted(() => {
    window.addEventListener('resize', checkScreenSize);
    loadHeroImages();
});

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
    if (sliderInterval) clearInterval(sliderInterval);
});

watch(isMobile, () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data } = JSON.parse(cached);
        renderImages(data);
    }
});
</script>

<template>
    <main>
        <div v-if="isLoading" class="skeleton-container">
            <div class="skeleton-banner"></div>
            <div class="skeleton-nav">
                <span></span><span></span><span></span>
            </div>
        </div>

        <div v-else-if="images.length > 0" class="slider">
            <div class="slides">
                <div 
                    class="slide" 
                    v-for="(image, index) in images" 
                    :key="index" 
                    :class="{ active: currentSlide === index + 1 }"
                >
                    <img :src="image.src" :alt="image.alt" loading="eager">
                </div>
            </div>

            <div class="navigation-manual">
                <span 
                    v-for="(image, index) in images" 
                    :key="index" 
                    class="manual-btn"
                    :class="{ active: currentSlide === index + 1 }"
                    @click="setSlide(index + 1)"
                ></span>
            </div>
        </div>
        
        <div v-else class="empty-hero">
            </div>
    </main>
</template>

<style scoped>
    /* slides */
    /* main{
        padding: 90px .5rem 0.5rem .5rem;
    } */
    .slider {
        width: 100%;
        position: relative;
        overflow: hidden;
        /* border-radius: 10px; */

    }

    .slides {
        display: flex;
        transition: transform 0.5s ease-in-out;
        transform: translateX(calc(-100% * (var(--currentSlide) - 1)));
    }

    .slide {
        min-width: 100%;
        transition: opacity 1s;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
    }

    .slide.active {
        opacity: 1;
        position: relative;
    }

    .slide img {
        width: 100%;
        height: 100%;
        /* border-radius: 10px; */
    }

    .navigation-manual {
        position: absolute;
        width: 100%;
        bottom: 10px;
        display: flex;
        justify-content: center;
    }

    .manual-btn {
        border: 2px solid var( --cor-azul-medio);
        padding: 6px;
        border-radius: 50%;
        margin: 0 5px;
        cursor: pointer;
        transition: background-color 0.5s;
    }

    .manual-btn.active {
        background-color: var( --cor-azul-medio);
    }
    /* fim slides */
    .animate {
        opacity: 0;
        transition: all 0.8s ease-out;
    }

    .in-view {
        opacity: 1;
    }

    .banner {
        display: flex;
        gap: 0.5rem;
        width: 100%;
        padding: 70px .5rem 0.5rem .5rem;
        position: relative;
    }

    .content {
        display: flex;
        flex: 1 0 380px;
        flex-direction: row; 
        /* position: relative; */
    }

    .image-content {
        order: 0; 
    }

    @media screen and (max-width: 1024px){
        .text_content h1 {
            font-size: 32px !important;
        }
        .text{
            font-size: 18px !important;
        }
        .text_content{
            flex: 1 0 380px !important; 
        }

    }

    @media screen and (max-width: 780px) {
        .content {
            flex-direction: column; 
            justify-content: center;
            position: relative;
        }
        .text_content{
            justify-content: flex-start;
            position: absolute;
            top: 80%;
            left: 7%;
        }

        .image-content {
            height: 80vh;
            order:-1;
            background-position: center !important;
        }
    /* 
        .vertical {  
            right: 20px;
            padding: 0 0 5rem 10px;
        } */
    } 

    @media screen and (max-width: 480px) {
        .content {
            flex-direction: column;
            position: relative;
            height: 75vh;
        }

        .text_content{
            justify-content: flex-start;
            position: absolute;
            top: 80%;
            left: 7%;
        }

        .image-content {
            height: 80vh;
            order:-1;
            background-position: center;
        }
        .socials{
            padding: 0 0 0.5rem 0 !important;
        }
    }


    .socials, .right-side {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 0 0 0.5rem 1rem;
        font-size: 1.2rem;
    }

    .socials a {
        text-decoration: none;
        color: var(--color-text);
        cursor: pointer;
    }

    .socials a:hover {
        color: var(--color-heading);
    }

    .text_content {
        display: flex;
        flex-direction: column;
        flex: 1 0 380px; 
        justify-content: center;
        align-content: center;
        align-items: center;
    }

    .text_content h1 {
        font-family: "Poppins", sans-serif;
        font-weight: 700;
        font-size: 42px;
        color: var(--color-heading);
    }

    .linha-vertical {
        border-left: 2px solid var(--color-text);
        height: 180px;
        margin: 0 0 0 8px;
    }

    .text {
        display: flex;
        flex-direction: column; 
        font-size: 22px;   
    }

    .image-content {
        display: flex;
        width: clamp(380px, 100%, 700px);
        /* background-image: url("/src/assets/hero1.jpg"); */
        overflow: hidden;
        filter: brightness(100%);
        filter: contrast(105%);
        /* opacity: 1; */
        background-repeat: no-repeat;
        background-size: contain;
        background-position: left;
        height: 88vh;
        /* justify-content: flex-end; */
        align-items: flex-end;
    }

    .element {
    background: linear-gradient(
        to top,
        black,
        rgba(255, 0, 0, 0)
    );
    width: 100%;
    height: 50%;
    }

    .vertical {  
        position: absolute;
        bottom: 50px;
        right: 5px;
        display: flex;
        transform: rotate(90deg);
        padding: 0 0 5rem 10px;
    }

    .botao-scroll {
        padding: 10px 20px;
        text-decoration: none;
        background-color: transparent;
        display: flex;
        flex-direction: row;
        gap: 10px;
        font-size: 0.9rem;
        color: var(--color-text);
        border: none;
        cursor: pointer;
        animation: moverVertical 2s infinite alternate;
        align-content: center;
    }

    @keyframes moverVertical {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(20px);
        }
    }


    /* Skeleton Styles */
.skeleton-container {
    width: 100%;
    position: relative;
}

.skeleton-banner {
    width: 100%;
    height: 88vh; /* Mesma altura do seu image-content */
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
}

.skeleton-nav {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.skeleton-nav span {
    width: 12px;
    height: 12px;
    background: #e0e0e0;
    border-radius: 50%;
}

@keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Ajuste Mobile para o Skeleton */
@media screen and (max-width: 780px) {
    .skeleton-banner {
        height: 80vh;
    }
}
</style>