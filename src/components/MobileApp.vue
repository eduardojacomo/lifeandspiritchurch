<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = ref([
  { icon: 'fa-solid fa-play', text: 'Receba conteúdos exclusivos.' },
  { icon: 'fa-solid fa-bible', text: 'Tenha a Bíblia no seu bolso.' },
  { icon: 'fa-solid fa-heart', text: 'Faça doações pelo aplicativo.' },
  { icon: 'fa-solid fa-clipboard-list', text: 'Faça inscrições nos eventos.' }
]);

const sectionRef = ref(null);
let ctx;

onMounted(() => {
  setTimeout(() => {
    ctx = gsap.context(() => {
      
      // Criamos uma timeline que controla o PIN e as animações
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: "top top",      // Trava quando o topo da seção chega no topo da tela
          end: "+=1000",         // Duração do scroll (quanto maior, mais lento o efeito)
          pin: true,             // Trava a seção na tela
          scrub: 1.5,            // Suaviza o movimento do scroll
          anticipatePin: 1,
        }
      });

      // --- SEQUÊNCIA DE ANIMAÇÃO ---

      // 1. Primeiro: O Mockup faz o Zoom Out (estava gigante, fica normal)
      tl.fromTo(".mockup-wrapper", 
        { scale: 4, opacity: 0, y: 100 },
        { scale: 1, opacity: 1, y: 0, duration: 2 }
      );

      // 2. Segundo: O Título entra (só começa depois que o celular quase terminou)
      tl.fromTo(".text-area h2", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.5" // Sobreposição leve
      );

      // 3. Terceiro: Os cards entram um por um da esquerda
      // Como estamos no scrub, cada card entra conforme você scrola
      tl.fromTo(".feature", 
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, stagger: 1, duration: 1.5 },
        "+=0.2" // Pequena pausa após o título
      );

      // 4. Quarto: Os botões das lojas
      tl.fromTo(".store-link", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.5, duration: 1 }
      );

    }, sectionRef.value);

    ScrollTrigger.refresh();
  }, 400);
});


onUnmounted(() => {
  if (ctx) ctx.revert(); // Limpa as animações para evitar vazamento de memória
});
</script>

<template>
  <section class="app-section" ref="sectionRef">
    <div class="container">
      <div class="app-content">
        <div class="text-area">
          <h2>Baixe nosso aplicativo e tenha a igreja 24 horas com você.</h2>
          
          <div class="features">
            <div class="feature" v-for="(item, index) in features" :key="index">
              <div class="feature-icon">
                <font-awesome-icon :icon="item.icon" />
              </div>
              <div class="feature-text">
                <p>{{ item.text }}</p>
              </div>
            </div>
          </div>

          <div class="store-buttons">
            <a href="#" class="store-link">
              <img src="@/assets/GooglePlayEN.png" alt="Google Play" />
            </a>
            <a href="#" class="store-link">
              <img src="@/assets/ApleStoreEN.svg" alt="App Store" />
            </a>
          </div>
        </div>

        <div class="mockup-area">
          <div class="mockup-wrapper">
            <img src="@/assets/app-mockup.png" alt="App Mockup" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* App Section */
.app-section {
  min-height: 100vh; /* Garante que ocupa a tela toda para o pin */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #22293b 0%, #031b6a 100%);
}

.app-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  border-radius: 50%;
}

.app-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
  border-radius: 50%;
}

.app-content {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4rem;
  position: relative;
  z-index: 1;
}

.app-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* Text Area */
.text-area {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.text-area h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  margin: 0;
}

/* Features */
.features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(8px);
}

.feature-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  color: #1e40af;
  font-size: 1.3rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.feature:hover .feature-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.feature-text {
  flex: 1;
}

.feature-text p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  font-weight: 500;
}

/* Store Buttons */
.store-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.store-link {
  display: inline-block;
  transition: all 0.3s ease;
}

.store-link:hover {
  transform: translateY(-4px);
}

.store-link img {
  height: 50px;
  width: auto;
  display: block;
  transition: all 0.3s ease;
}

.store-link:hover img {
  filter: brightness(1.1);
}


.mockup-area {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* Importante para o zoom gigante não quebrar o layout */
  perspective: 1000px; 
}

.mockup-wrapper {
  position: relative;
  max-width: 350px;
  width: 100%;
  z-index: 10;
  /* Remova a animação 'float' daqui se ela conflitar com o zoom inicial */
  /* Vamos aplicá-la apenas na imagem interna */
}

.mockup-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4));
  /* A animação de flutuar deve ser suave para não brigar com o GSAP */
  animation: float 6s ease-in-out infinite;
}

/* Garante que o container pai não corte o zoom out */
.app-section {
  overflow: clip;
}

.text-area h2, 
.feature, 
.store-link, .mockup-wrapper {
  opacity: 0; /* Começam invisíveis */
  will-change: transform, opacity;
}

/* O mockup também começa invisível para o zoom-out */
.mockup-wrapper {
  opacity: 0;
}

/* IMPORTANTE: Remova qualquer transição de CSS anterior (.animate, .in-view) 
   para que o CSS não brigue com o GSAP */
.feature {
  transition: background 0.3s ease, transform 0.3s ease; /* Apenas para o hover */
}

/* Evita "pulos" de layout enquanto o GSAP carrega */
[data-v-app] {
  overflow-x: hidden;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}


/* Responsive */
@media screen and (max-width: 1024px) {
  .app-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .mockup-wrapper {
    max-width: 300px;
  }

  .features {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 768px) {
  .app-section {
    padding: 4rem 0;
  }

  .container {
    padding: 0 1.5rem;
  }

  .app-content {
    gap: 2.5rem;
    display: flex; 
    flex-direction: column;
  }

.text-area {
    display: contents; 
  }

  .text-area h2 {
    font-size: 1.8rem;
    order: 1;
  }

  .features{
    order: 3;
  }

  .feature {
    padding: 1rem;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .feature-text p {
    font-size: 0.95rem;
  }

  .mockup-wrapper {
    max-width: 280px;
  }

  .store-buttons {
    justify-content: center;
    order: 43;
  }
  .mockup-area { 
    order: 2; /* aparece logo após o h2 */ 
    margin-top: 1.5rem; 
  }
}

@media screen and (max-width: 480px) {
  .app-section {
    padding: 3rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .text-area h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .feature {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .feature-text p {
    font-size: 0.9rem;
  }

  .store-buttons {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .store-link {
    width: 100%;
    max-width: 200px;
  }

  .store-link img {
    width: 100%;
    height: auto;
  }

  .mockup-wrapper {
    max-width: 250px;
  }
}
</style>