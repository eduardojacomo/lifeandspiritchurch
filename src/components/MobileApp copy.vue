<template>
    <section class="app-section">
      <div class="content">
        <div class="card__container">
          <div class="text-area animate">
            <h2>Baixe nosso aplicativo e tenha a igreja 24 horas com você.</h2>
            <div class="features">
              <div class="feature" v-for="(item, index) in features" :key="index">
                <font-awesome-icon :icon="item.icon"></font-awesome-icon>
                <div>
                  <p>{{ item.text }}</p>
                  <div class="divider"></div>
                </div>
              </div>
            </div>
            <div class="store-buttons">
              <img src="@/assets/GooglePlayEN.png" alt="Google Play" />
              <img src="@/assets/ApleStoreEN.svg" alt="App Store" />
            </div>
          </div>
    
          <div class="mockup animate">
            <img src="@/assets/app-mockup.png" alt="App Mockup" />
          </div>

        </div>
      </div>
    </section>
  </template>
  
  <script setup>
    import {ref, onMounted} from 'vue'
  
    const features = ref([
        { icon: 'fa-solid fa-play', text: 'Receba conteúdos exclusivos.' },
        { icon: 'fa-solid fa-bible', text: 'Tenha a Bíblia no seu bolso.' },
        { icon: 'fa-solid fa-heart', text: 'Faça doações pelo aplicativo.' },
        { icon: 'fa-solid fa-clipboard-list', text: 'Faça inscrições nos eventos.' }
    ])

    const observeElements = (el) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
            });
        });

        el.forEach((element) => observer.observe(element));
        };

    onMounted(() => {
        const sections = document.querySelectorAll('.animate');
        observeElements(sections);
    });
  </script>
  
  <style scoped>
  .app-section {
    background-color: var(--cor-azul-medio);
    color: #111;
    padding: 4rem 12rem;
  }

 .animate {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease-out;
 }

 .in-view {
    opacity: 1;
    transform: translateY(0);
 }
  
  .content {
    display: flex;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
  }
  
  .card__container{
    max-width: 1280px;
    display: flex;
  }

  .text-area {
    flex: 1;
    min-width: 300px;
    max-width: 600px;
  }
  
  .text-area h2 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  
  .features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .feature {
    display: flex;
    align-items: start;
    gap: 1rem;
  }
  
  .feature i {
    font-size: 1.5rem;
    color: black;
  }
  
  .divider {
    height: 2px;
    width: 40px;
    background-color: black;
    margin-top: 0.4rem;
  }
  
  .store-buttons img {
    height: 45px;
    margin-right: 1rem;
    cursor: pointer;
  }
  
  .mockup {
    flex: 1;
    width: 350px;
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
  }
  
  .mockup img {
    max-width: 300px;
    width: 100%;
  }

  @media screen and (max-width: 768px){
    .app-section {
        background-color: var(--cor-azul-medio);
        color: #111;
        padding: 4rem 1rem;
    }
    .content{
        flex-direction: column;
    }
  }
  </style>
  