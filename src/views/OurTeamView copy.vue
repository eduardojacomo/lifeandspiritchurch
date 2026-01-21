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
        pt: "Pastores",
        en: "Pastors"
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
        We dated for only one month and, under God’s guidance, decided to get married. The Lord blessed us with four wonderful children — three girls and one boy. In addition to them, 
        I am also the father of three other children, whom God gifted me before our marriage. Each one is part of the Lord’s perfect plan for our lives. From 2008 to 2009, we experienced an unforgettable milestone: 
        we surrendered our lives to Jesus, and in April 2009, we were baptized. At that moment, we understood that we didn’t just want to attend a church, but we desired to actively serve the Lord. At that time, 
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

const Team = {
    title: {
        pt: "Nossa Equipe",
        en: "Our Team"
    },
    content: {
        pt: "O Ministério Life & Spirit Church é uma congregação enraizada na Palavra de Deus e dedicada a alcançar vidas de todas as nações e raças. Fundado por Cristiano da Silva e Kauane Gomes da Mata, nosso ministério nasceu da direção divina em junho de 2019 para seguir a única doutrina: a Bíblia, totalmente inspirada por Deus.\n\nSomos uma família vibrante de crentes que vivenciam profundamente o amor e a presença de Deus, unindo-se a Jesus para expressar a alegria e o poder do Seu reino em todas as áreas da vida. Nosso centro de operações está sediado em Claremorris, Co Mayo, Irlanda, e em novembro de 2019 fomos oficialmente registrados como Igreja Cristã na Irlanda, expandindo nosso alcance e conexão com outras igrejas globalmente. Convidamos você a se juntar a nós nesta jornada para que todos possam conhecer verdadeiramente a Deus e Pai.",
        en: "Life & Spirit Church Ministry is a congregation rooted in the Word of God and dedicated to reaching lives of all nations and races. Founded by Cristiano da Silva and Kauane Gomes da Mata, our ministry was born from divine direction in June 2019 to follow the sole doctrine: the Bible, fully inspired by God.\n\nWe are a vibrant family of believers who deeply experience the love and presence of God, uniting with Jesus to express the joy and power of His kingdom in all areas of life. Our operations center is based in Claremorris, Co Mayo, Ireland, and in November 2019 we were officially registered as a Christian Church in Ireland, expanding our reach and connection with other churches globally. We invite you to join us on this journey so that everyone can truly know God the Father."
    }
};


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
      <div class="container">
        <div class="row">
                    <div class="scrolling-text-container">
            <div class="scrolling-text">
              <div class="scrolling-text-content">
                <span>PASTORS - </span>
                <span>PASTORS - </span>
              </div>
              <div class="scrolling-text-content">
                <span>PASTORS - </span>
                <span>PASTORS - </span>
              </div>
            </div>
          </div>
          <div class="content-about animate">
           
            <div class="row-text">
              <div class="title animate">
                <Transition name="fade-blur" mode="out-in">
                  <h1 :key="currentLocaleKey"> {{ Pastors.title?.[locale] }} </h1>
                </Transition>
              </div>
              <div class="column-pastor">
                <div class="about-pastor">
                  <Transition name="fade-blur" mode="out-in">
                    <p :key="currentLocaleKey" >{{ Pastors.content?.[locale] }}</p>
                  </Transition>
                </div>
                <div class="image-about animate px1">
                  <Transition name="fade-blur" mode="out-in">
                    <div class="image1">
                      <img src="/src/assets/pastor.jpeg" alt="Me" :key="currentLocaleKey" />
                    </div>
                  </Transition>
                  <Transition name="fade-blur" mode="out-in">
                    <div class="image2">
                      <img src="/src/assets/pastora.jpeg" alt="Me" :key="currentLocaleKey" />
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>

          <div class="content-about animate bg-blue">
            <!-- <div class="row-text">
                <div class="row">
                  <div class="cards">
                    <div class="title animate">
                    <Transition name="fade-blur" mode="out-in">
                      <h1 :key="currentLocaleKey">{{ Team.title?.[locale] }}</h1>
                    </Transition>
                  </div>
                  <div class="about-description">
                    <Transition name="fade-blur" mode="out-in">
                      <p :key="currentLocaleKey" >{{ Team.content?.[locale] }}</p>
                    </Transition>
                  </div>
                  </div>
                  <div class="cards">
                    <div class="title animate">
                      <Transition name="fade-blur" mode="out-in">
                        <h1 :key="currentLocaleKey"> {{ Mission.title?.[locale] }} </h1>
                      </Transition>
                    </div>
                    <div class="about-description">
                      <Transition name="fade-blur" mode="out-in">
                        <p :key="currentLocaleKey" >{{ Mission.content?.[locale] }}</p>
                      </Transition>
                    </div>
                  </div>
                </div> 
            </div> -->
        </div>

        </div>
      </div>

  </main>
</template>
  

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  min-height: 87vh;
  width: 100%;
  padding: 100px 0 2rem 0;
}

.title {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  /* padding: 1rem; */
}

.title h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
}

.title h2{
    font-size: 1.5rem;
  font-weight: 500;
}

.card-skill{
  border: solid 1px var(--color-border);
  /* border-radius: 8px; */
  background-color: transparent;
}

.content-about {
  display: flex;
  padding: 0 10rem;
  flex-direction: column;
  text-align: justify;
  align-items: center;
  justify-content: center;
  /* flex-wrap: wrap-reverse; */
  gap: 3rem;
  position: relative;
}

.content.animate p{
    font-size: 1rem;
    padding: 1rem 0 1rem 2rem;
}

.cards {
  /* display: flex;
  gap: 1.5rem; */
  padding: 0 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: clamp(350px, 100%, 475px);
}

.column, .card-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
}
.card-content{
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.row, .row-text {
    display: flex;
    flex-direction: column;
    z-index: 100;
    position: relative;
}

.row {
  gap: 2rem;
}

.row-text{
  gap: .5rem;
  max-width:1280px ;
}

.image-about{
    display: flex;
    padding: .5 rem;
    justify-content: center;
    align-items: center;
    min-width: 380px !important;
    height: 550px;
    /* overflow: hidden; */
    position: relative;
}

.image1, .image2{
  width: 280px;
  height: 380px;
  border: none;
  border-radius: 8px;
  overflow: hidden;
}

.image1{
  position: absolute;
  top: 10px;
  left: -10px;
  z-index: 1;
}

.image2{
  position: absolute;
  top: 250px;
  left: 150px;
  z-index: 10;
}


.image-about img{
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  object-fit: cover;
  object-position:top;
}

.category h3 {
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  color: var(--color-text);
  /* margin-bottom: .5rem; */
}

h3{
  font-size: .8rem;
  font-weight: 500;
  color: var(--color-heading);
}

.about-description ul{
  list-style:none;
  margin: 0;
  padding: 0;
}


.column-pastor{
  display: flex;
  gap: 2.5rem;
  flex-wrap: nowrap;
}

.px1{
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.py1{
  padding-left: 1rem;
  padding-right: 1rem;
}

.card-values{
  display: flex;
  flex-direction: column;
  width: 175px;
  padding: 1rem .5rem;
  border: solid 1px var(--color-border);
  background-color: var(--color-background-soft);
  align-items: center;
  text-align: center;
  justify-content: center;
  border-radius: 5px;
}

.bg-blue{
  background-color: var(--cor-azul-escuro);
  padding: 250px 0;
  margin-top: -300px;
  padding-bottom: 3rem;
}


.btn-more{
  display: flex;
  text-decoration: none;
  padding: 1rem;
  border: solid 1px var(--color-border);
  background-color: transparent;
  cursor: pointer;
  color: var(--color-text);
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: 150px;
  animation: all .5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.btn-more:hover{
  background-color: var(--color-background-soft);
}


.scrolling-text-container {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 100;
  position: absolute;
  bottom: 50px;
}

.scrolling-text {
  display: flex;
  width: max-content;
  animation: scroll-x 20s linear infinite;
  font-size: 72px;
}

.scrolling-text-content {
  display: flex;
}

.scrolling-text span {
  display: inline-block;
  margin-right: 50px;
  font-size: 2em;
  font-weight: bold;
  color: var(--color-text);
  opacity: 0.1;
}

/* Scroll contínuo */
@keyframes scroll-x {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media screen and (max-width: 1024px) {
  .content-about{
    padding: 0 2rem;
    flex-wrap: wrap;
  }
  .image-about{
    top: 280px;
  }
  .bg-blue{
    padding-top: 450px !important;
    padding-bottom: 2rem !important;
    margin-top: -500px;
  }
  .scrolling-text-container {
    padding-top:550px;
  }
}

@media screen and (max-width: 768px) {
  .content {
    padding: 0 1rem;
  }

  .content.animate p{
    padding: 0;
  }

  .container{
    padding: 70px .5rem 1rem .5rem;
  }

  .image-about{
    top: 310px;
  }

  .bg-blue{
    padding-top: 450px !important;
    padding-bottom: 2rem !important;
  }

  .scrolling-text{
    display: none;
  }

  .column-pastor{
    flex-wrap: wrap;
  }
  
}

@media screen and (max-width: 480px) {
  .title h1 {
    font-size: 1.8rem;
  }

  .content.animate p {
    font-size: 1rem;
  }

  .cards {
    padding: 0.5rem;
    gap: 0.5rem;
  }

   .image-about{
    top: 510px;
  }

  .card-values{
    width: 170px;
  }
  .content {
    padding: 0 1rem;
  }

  .content-about{
    padding: 0 1rem;
  }
   .bg-blue{
    margin-top: -400px;
    padding-top: 400px !important;
    padding-bottom: 2rem !important;
  }


}

</style>
