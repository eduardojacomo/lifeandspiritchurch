<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useLanguage} from '../stores/languageStore'
import { useCollection } from 'vuefire'
import { collection, addDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
const db = useFirestore()

const users = useCollection(collection(db, 'users'))
const categories = useCollection(collection(db, 'activities'))

const uselanguage = useLanguage();
const { currentLocaleKey, locale} = storeToRefs(uselanguage);

const { t } = useI18n();

const Pastors = {
    title: {
        pt: "Nossos Pastores",
        en: "Our Pastors"
    },
    content: {
        pt: `Eu sou o pastor Cristiano, casado com a pastora Kauane desde 2008. Nossa história começou de uma forma muito especial: eu já estava morando na Irlanda desde 2003 e, 
        em uma viagem de férias ao Brasil, nós nos conhecemos. Namoramos apenas por um mês e, com a direção de Deus, decidimos nos casar. O Senhor nos abençoou com quatro filhos maravilhosos — 
        três meninas e um menino. Além deles, também sou pai de outros três filhos, que Deus me presenteou antes do nosso casamento. Cada um é parte do plano perfeito do Senhor para nossa vida. 
        Em 2008 para 2009, vivemos um marco inesquecível: nos entregamos a Jesus e, em abril de 2009, fomos batizados. Naquele momento, entendemos que não queríamos apenas frequentar uma igreja, 
        mas desejávamos servir ativamente ao Senhor. Na época, ainda não havia uma igreja fixa em Dublin, então os cultos eram realizados em um ginásio. Isso significava montar e desmontar cadeiras, 
        equipamentos de som e tudo mais a cada encontro. Foi nesse cenário que nasceu nossa paixão pelo ministério. Nosso primeiro pastor, Fernando, foi quem nos batizou e nos ensinou a conhecer Jesus de verdade. 
        Ele também nos deu a oportunidade de servir, e desde então começamos a nos envolver de corpo e alma: ajudando na obra, aprendendo, evangelizando e crescendo espiritualmente. O caminho não foi fácil. 
        Aceitar o chamado pastoral sempre é um desafio — muitas vezes pensamos que somos improváveis para tamanha responsabilidade. Mas Deus é fiel e, com o tempo, Ele confirmou nossa vocação. 
        Passamos pelo diaconato, presbitério, evangelismo, até que, pela graça do Senhor, fui ordenado pastor. Hoje, servimos juntos na Life and Spirit Church, que Deus nos confiou aqui na Irlanda. 
        Temos um sonho que nos move: ver pessoas se entregando verdadeiramente a Jesus, vivendo uma relação com Ele que vai além das palavras, algo que só pode ser explicado pelo poder do Espírito Santo. 
        Nossa igreja é um reflexo do Reino de Deus: temos oito nacionalidades reunidas em adoração. Entre elas estão brasileiros, portugueses, romenos, espanhóis, peruanos, colombianos e dominicanos. 
        Uma verdadeira família multicultural unida pelo mesmo Espírito. Cada passo dessa jornada foi dirigido por Deus. E seguimos firmes, cheios de gratidão, confiando que o melhor ainda está por vir.`,
        en: `I am Pastor Cristiano, married to Pastor Kauane since 2008. Our story began in a very special way: I had already been living in Ireland since 2003, and during a vacation trip to Brazil, we met. 
        We dated for only one month and, under God's guidance, decided to get married. The Lord blessed us with four wonderful children — three girls and one boy. In addition to them, 
        I am also the father of three other children, whom God gifted me before our marriage. Each one is part of the Lord's perfect plan for our lives. From 2008 to 2009, we experienced an unforgettable milestone: 
        we surrendered our lives to Jesus, and in April 2009, we were baptized. At that moment, we understood that we didn't just want to attend a church, but we desired to actively serve the Lord. At that time, 
        there was no established church in Dublin, so services were held in a gymnasium. This meant setting up and taking down chairs, sound equipment, and everything else at each gathering. It was in this setting 
        that our passion for ministry was born. Our first pastor, Fernando, was the one who baptized us and taught us to truly know Jesus. He also gave us the opportunity to serve, and since then we began to get 
        involved wholeheartedly: helping in the work, learning, evangelizing, and growing spiritually. The journey was not easy. Accepting the pastoral calling is always a challenge — many times we think 
        we are unlikely candidates for such great responsibility. But God is faithful, and over time He confirmed our vocation. We went through the diaconate, the presbytery, evangelism, until, by the grace of the Lord,
         I was ordained as a pastor. Today, we serve together at Life and Spirit Church, which God entrusted to us here in Ireland. We have a dream that drives us: to see people truly surrendering to Jesus, 
         living a relationship with Him that goes beyond words — something that can only be explained by the power of the Holy Spirit. Our church is a reflection of the Kingdom of God: we have eight nationalities
          gathered in worship. Among them are Brazilians, Portuguese, Romanians, Spaniards, Peruvians, Colombians, and Dominicans. A true multicultural family united by the same Spirit. Every step of this journey 
          has been directed by God. And we continue steadfast, full of gratitude, trusting that the best is yet to come.`
    }
};

watch(locale, () => {
  // Isso forçará a atualização do conteúdo quando o idioma mudar
});

onMounted(() => {
  const sections = document.querySelectorAll('.animate');
  // observeElements(sections);
});
</script>

<template>
    <main>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <img src="/src/assets/aboutphotoedited.png" alt="Pastor Cristiano & Pastora Kauane" />
        </div>
      </section>
      
      <!-- About Pastors Section -->
      <section class="about-section">
        <div class="container">
          <div class="about-content-flex">
            <!-- Images Section -->
            <div style="width: 100%;">
              <Transition name="fade-blur" mode="out-in">
                <h1 :key="currentLocaleKey" class="hero-title">{{ Pastors.title?.[locale] }}</h1>
              </Transition>
              
            </div>
            <div class="divider"></div>
            <!-- Text Content -->
            <div class="pastors-text">
              <Transition name="fade-blur" mode="out-in">
                <div :key="currentLocaleKey" class="text-content">
                  <p v-for="(paragraph, index) in Pastors.content?.[locale].split(/\n\s*\n/)" :key="index">
                    {{ paragraph.trim() }}
                  </p>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </section>
    </main>
</template>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  /* height: 50vh; */
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  /* margin-bottom: 4rem; */
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  aspect-ratio: 810 / 455;
  border-radius: 18px;
  overflow: hidden;
  padding: 12rem 15rem 0 15rem;
  /* padding: 2rem; */
}

.hero-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
  /* padding: 15rem 15rem 0 15rem;*/
} 

.hero-title {
  font-size: clamp(1.5rem, 8vw, 4rem);
  font-weight: 900;
  letter-spacing: -2px;
  text-transform: uppercase;
  color: var(--color-heading);
  margin: 0;
  text-align: center;
}

.about-tittle{
    font-size: clamp(1.5rem, 8vw, 4rem);
  font-weight: 900;
  letter-spacing: -2px;
  text-transform: uppercase;
  color: var(--color-heading);
  margin: 0;
}

/* About Section */
.about-section {
  padding: 4rem 0 6rem 0;
  background: var(--color-background);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-content-grid {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 4rem;
  align-items: start;
}

.about-content-flex {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  
}

/* Pastors Images */
.pastors-images {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.images-wrapper {
  position: relative;
  width: 100%;
  height: 600px;
}

.image-card {
  position: absolute;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
}

.image-card:hover {
  transform: scale(1.02) translateY(-5px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.image-1 {
  width: 300px;
  height: 400px;
  top: 0;
  left: 0;
  z-index: 2;
}

.image-2 {
  width: 300px;
  height: 400px;
  top: 220px;
  right: 0;
  z-index: 3;
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.4s ease;
}

.image-card:hover img {
  transform: scale(1.05);
}
.divider {
  width: 60px;
  height: 4px;
  background: var(--color-heading);
  margin: -1rem auto 0 auto ;
 
}
/* Pastors Text */
.pastors-text {
  display: flex;
  flex-direction: column;
  max-width: 900px;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.text-content p {
  font-size: 1.1rem;
  line-height: 2;
  color: var(--color-text);
  text-align: justify;
  opacity: 0.9;
}

/* Transitions */
.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: all 0.5s ease;
}

.fade-blur-enter-from {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px);
}

.fade-blur-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(-20px);
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .hero-section {
    height: 40vh;
    min-height: 350px;
  }

  .about-content-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .pastors-images {
    position: relative;
    top: 0;
    margin: 0 auto;
    max-width: 500px;
  }

  .images-wrapper {
    height: 500px;
  }

  .image-1 {
    width: 280px;
    height: 380px;
    left: 20px;
  }

  .image-2 {
    width: 280px;
    height: 380px;
    top: 150px;
    right: 20px;
  }

  .text-content p {
    font-size: 1rem;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }

  /* .hero-section {
    height: 35vh;
    min-height: 300px;
    margin-bottom: 3rem;
  } */

   .hero-section {
    height: 500px;
  }

  .hero-content {
    padding: 0;
    height: 100%;
    padding: 4rem 0 0 2rem;
  }

  .hero-content img {
    border-radius: 0;
    object-fit: cover;
    object-position: center top;
  }
  .about-section {
    padding: 3rem 0 4rem 0;
  }

  .about-content-grid {
    gap: 2.5rem;
  }

  .images-wrapper {
    height: 450px;
  }

  .image-1,
  .image-2 {
    width: 240px;
    height: 320px;
  }

  .image-1 {
    left: 10px;
  }

  .image-2 {
    top: 140px;
    right: 10px;
  }

  .text-content p {
    font-size: 1rem;
    line-height: 1.8;
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .hero-section {
    margin-bottom: 2rem;
    min-height: 250px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .about-section {
    padding: 2rem 0 3rem 0;
  }

  .about-content-grid {
    gap: 2rem;
  }

  .pastors-images {
    max-width: 350px;
  }

  .images-wrapper {
    height: 400px;
  }

  .image-1,
  .image-2 {
    width: 200px;
    height: 280px;
  }

  .image-1 {
    left: 0;
    top: 20px;
  }

  .image-2 {
    top: 150px;
    right: 0;
  }

  .text-content p {
    font-size: 0.95rem;
    line-height: 1.7;
  }
}
</style>