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

const AboutUs = {
    title: {
        pt: "Sobre Nós",
        en: "About Us"
    },
    content: {
        pt: "O Ministério Life & Spirit Church é uma congregação enraizada na Palavra de Deus e dedicada a alcançar vidas de todas as nações e raças. Fundado por Cristiano da Silva e Kauane Gomes da Mata, nosso ministério nasceu da direção divina em junho de 2019 para seguir a única doutrina: a Bíblia, totalmente inspirada por Deus.\n\nSomos uma família vibrante de crentes que vivenciam profundamente o amor e a presença de Deus, unindo-se a Jesus para expressar a alegria e o poder do Seu reino em todas as áreas da vida. Nosso centro de operações está sediado em Claremorris, Co Mayo, Irlanda, e em novembro de 2019 fomos oficialmente registrados como Igreja Cristã na Irlanda, expandindo nosso alcance e conexão com outras igrejas globalmente. Convidamos você a se juntar a nós nesta jornada para que todos possam conhecer verdadeiramente a Deus e Pai.",
        en: "Life & Spirit Church Ministry is a congregation rooted in the Word of God and dedicated to reaching lives of all nations and races. Founded by Cristiano da Silva and Kauane Gomes da Mata, our ministry was born from divine direction in June 2019 to follow the sole doctrine: the Bible, fully inspired by God.\n\nWe are a vibrant family of believers who deeply experience the love and presence of God, uniting with Jesus to express the joy and power of His kingdom in all areas of life. Our operations center is based in Claremorris, Co Mayo, Ireland, and in November 2019 we were officially registered as a Christian Church in Ireland, expanding our reach and connection with other churches globally. We invite you to join us on this journey so that everyone can truly know God the Father."
    }
};

console.log('Objeto Sobre Nós:', AboutUs);

const Mission = {
    title: {
        pt: "Nossa Missão",
        en: "Our Mission"
    },
    content: {
        pt: "Buscar a glória de Deus, por meio da adoração racional, evangelização de pessoas, comunhão, ação social e crescimento espiritual dos seus membros. Somos uma Igreja em um país que fala a língua inglesa e somos uma igreja multicultural, pois os pastores fundadores são imigrantes Brasileiros e recebemos pessoas de várias outras nacionalidades. Então, trabalhamos da melhor forma possível para seguirmos os padrões bíblicos que Deus nos deixou, incluindo todos, independente de qual seja sua nacionalidade ou qual seja o ministério que está vindo, pois nosso dever é seguir em amor, fazendo a vontade de Deus e trazendo unidade entre todos.",
        en: "To seek the glory of God through rational worship, evangelism, fellowship, social action, and the spiritual growth of its members. We are a Church in an English-speaking country and a multicultural church, as the founding pastors are Brazilian immigrants and we welcome people of various other nationalities. Therefore, we work in the best possible way to follow the biblical standards that God has given us, including everyone, regardless of their nationality or the ministry they come from, because our duty is to follow in love, doing God's will and bringing unity among all."
    }
};

const Vision = {
    title: {
        pt: "Nossa Visão",
        en: "Our Vision"
    },
    content: {
        pt: "Ser uma grande igreja missionária, fiel a Deus e à Bíblia, relevante ao seu contexto urbano e comprometida com a evangelização de pessoas.",
        en: "To be a great missionary church, faithful to God and the Bible, relevant to its urban context, and committed to evangelism."
    }
};

const Values = {
    title: {
        pt: "Nossos Valores",
        en: "Our Values"
    },
    content: [
        {
            order: 1,
            text: {
                pt: 'Vida de Fé',
                en: 'Life of Faith'
            }
        },
        {
            order: 2,
            text: {
                pt: 'Unidade e Amor',
                en: 'Unity and Love'
            }
        },
        {
            order: 3,
            text: {
                pt: 'Integridade',
                en: 'Integrity'
            }
        },
        {
            order: 4,
            text: {
                pt: 'Alegria e Paz',
                en: 'Joy and Peace'
            }
        },
        {
            order: 5,
            text: {
                pt: 'Firmeza doutrinária',
                en: 'Doctrinal Steadfastness'
            }
        },
        {
            order: 6,
            text: {
                pt: 'Fervor do Espírito',
                en: 'Fervor of the Spirit'
            }
        },
        {
            order: 7,
            text: {
                pt: 'Coração para Servir',
                en: 'Heart for Service'
            }
        },
        {
            order: 8,
            text: {
                pt: 'Edificação de pessoas',
                en: 'Edification of People'
            }
        },
        {
            order: 9,
            text: {
                pt: 'Excelência',
                en: 'Excellence'
            }
        },
        {
            order: 10,
            text: {
                pt: 'Vida abundante',
                en: 'Abundant Life'
            }
        }
    ]
};

const OurBeliefs = {
    title: {
        pt: "No que cremos?",
        en: "What we believe?"
    },
    sections: [
        {
            heading: {
                pt: "CREMOS NAS ESCRITURAS:",
                en: "WE BELIEVE IN THE SCRIPTURES:"
            },
            content: {
                pt: "A Bíblia é a Palavra inspirada de Deus, produto de homens santos do passado que falaram e escreveram conforme eram movidos e inspirados pelo Espírito Santo. Cremos na Nova Aliança, registrada no Novo Testamento, como nosso guia infalível em assuntos concernentes à conduta e doutrina (2 Timóteo 3.16, 1 Tessalonicenses 2.13 e 2 Pedro 1.20-21);",
                en: "The Bible is the inspired Word of God, the product of holy men of old who spoke and wrote as they were moved and inspired by the Holy Spirit. We believe in the New Covenant, recorded in the New Testament, as our infallible guide in matters concerning conduct and doctrine (2 Timothy 3:16, 1 Thessalonians 2:13, and 2 Peter 1:20-21);"
            }
        },
        {
            heading: {
                pt: "CREMOS NA TRINDADE:",
                en: "WE BELIEVE IN THE TRINITY:"
            },
            content: {
                pt: "Nosso Deus é um, manifesto em três pessoas – o Pai, o Filho e o Espírito Santo (2 Coríntios 13.13 e Mateus 28.19), que são coiguais (Filipenses 2.6, 1 Coríntios 2.10-12). Deus Pai é a fonte da Palavra (Logos) e o gerador da vida (João 14.28, 16.28 e 1.14). O Filho é a Palavra revestida de carne, aquele que existe com o Pai desde o princípio e foi gerado milagrosamente no ventre de Maria (João 1.1; 1.18 e 1.14). O Espírito Santo procede tanto do Pai como do Filho, habita em nós, nos guia, nos fortalece e é eterno (João 15.26, 1 Coríntios 6.19, Romanos 8.14 e Efésios 3.16);",
                en: "Our God is one, manifested in three persons – the Father, the Son, and the Holy Spirit (2 Corinthians 13:13 and Matthew 28:19), who are co-equal (Philippians 2:6, 1 Corinthians 2:10-12). God the Father is the source of the Word (Logos) and the generator of life (John 14:28, 16:28, and 1:14). The Son is the Word clothed in flesh, who exists with the Father from the beginning and was miraculously begotten in Mary's womb (John 1:1; 1:18 and 1:14). The Holy Spirit proceeds from both the Father and the Son, dwells in us, guides us, strengthens us, and is eternal (John 15:26, 1 Corinthians 6:19, Romans 8:14, and Ephesians 3:16);"
            }
        },
        {
            heading: {
                pt: "CREMOS NO HOMEM, NA SUA QUEDA E REDENÇÃO:",
                en: "WE BELIEVE IN MAN, HIS FALL AND REDEMPTION:"
            },
            content: {
                pt: "O homem é um ser criado, feito à imagem e semelhança de Deus. Contudo, por meio da transgressão e queda de Adão o pecado entrou no mundo. “Porque todos pecaram e destituídos estão da glória de Deus”. Assim está escrito: “Não há um justo, nem um sequer”. Jesus Cristo, o Filho de Deus, foi manifestado para desfazer as obras do diabo, deu sua vida e derramou o seu sangue para redimir e restaurar o homem para com Deus (Romanos 5.12 e 14, 3.10 e 23 e 1 João 3.8). A Salvação é o dom de Deus para o homem, não opera mediante obras da lei, mas sim pela graça, por meio da fé em Jesus Cristo, e produz obras agradáveis a Deus (Efésios 2.8);",
                en: "Man is a created being, made in the image and likeness of God. However, through Adam's transgression and fall, sin entered the world. 'For all have sinned and fall short of the glory of God.' Thus it is written: 'There is no one righteous, not even one.' Jesus Christ, the Son of God, was manifested to destroy the works of the devil, gave His life, and shed His blood to redeem and restore man to God (Romans 5:12 and 14, 3:10 and 23, and 1 John 3:8). Salvation is the gift of God to man, it does not operate through works of the law, but by grace, through faith in Jesus Christ, and produces works pleasing to God (Ephesians 2:8);"
            }
        },
        {
            heading: {
                pt: "CREMOS NA VIDA ETERNA E NO NOVO NASCIMENTO:",
                en: "WE BELIEVE IN ETERNAL LIFE AND THE NEW BIRTH:"
            },
            content: {
                pt: "O primeiro passo do homem em direção à salvação é a tristeza piedosa que resulta em arrependimento, seguido da fé na obra consumada do Senhor Jesus Cristo. O novo nascimento é necessário para todos os homens e quando cumprido produz vida eterna (2 Coríntios 7.10, 1 João 5.12, João 3.3-5 e Gálatas 3.11);",
                en: "Man's first step toward salvation is godly sorrow that leads to repentance, followed by faith in the finished work of the Lord Jesus Christ. The new birth is necessary for all men and when accomplished produces eternal life (2 Corinthians 7:10, 1 John 5:12, John 3:3-5, and Galatians 3:11);"
            }
        },
        {
            heading: {
                pt: "CREMOS NO BATISMO NAS ÁGUAS:",
                en: "WE BELIEVE IN WATER BAPTISM:"
            },
            content: {
                pt: "O batismo nas águas é por imersão e constitui um mandamento expresso do nosso Senhor Jesus para os cristãos. A ordenança é o símbolo da identificação do cristão com Cristo em sua morte, sepultamento e ressurreição (Mateus 28.19 e Atos 8.36-39). Concernente ao batismo nas águas, uma regra é adotada, a saber, “Sobre a tua confissão de fé no Senhor Jesus Cristo, o Filho de Deus, e pela Sua autoridade, eu te batizo em nome do Pai, e do Filho, e do Espírito Santo. Amém”;",
                en: "Water baptism is by immersion and constitutes an express command of our Lord Jesus for Christians. The ordinance is the symbol of the Christian's identification with Christ in His death, burial, and resurrection (Matthew 28:19 and Acts 8:36-39). Concerning water baptism, one rule is adopted, namely, 'Upon your confession of faith in the Lord Jesus Christ, the Son of God, and by His authority, I baptize you in the name of the Father, and of the Son, and of the Holy Spirit. Amen';"
            }
        },
        {
            heading: {
                pt: "CREMOS NO BATISMO NO ESPÍRITO SANTO:",
                en: "WE BELIEVE IN THE BAPTISM IN THE HOLY SPIRIT:"
            },
            content: {
                pt: "O batismo no Espírito Santo é um dom de Deus, prometido pelo Senhor Jesus Cristo, para todos os crentes desta dispensação. É recebido subsequentemente ao Novo Nascimento. Essa experiência é acompanhada pela evidência inicial e perene de falar em outras línguas conforme o próprio Espírito Santo concede (Mateus 3.11, João 14.16 e 17, Atos 1.8, 2.38-39, 19.1-7 e 2.4);",
                en: "The baptism in the Holy Spirit is a gift from God, promised by the Lord Jesus Christ, to all believers of this dispensation. It is received subsequent to the New Birth. This experience is accompanied by the initial and enduring evidence of speaking in other tongues as the Holy Spirit Himself grants (Matthew 3:11, John 14:16 and 17, Acts 1:8, 2:38-39, 19:1-7, and 2:4);"
            }
        },
        {
            heading: {
                pt: "CREMOS NA SANTIFICAÇÃO:",
                en: "WE BELIEVE IN SANCTIFICATION:"
            },
            content: {
                pt: "A Bíblia ensina que sem santificação ninguém verá o Senhor. Cremos na doutrina da santificação como uma obra definitiva e progressiva da graça, começando no momento da regeneração e tendo continuidade até a consumação da salvação, respectivamente (Hebreus 12.14, 1 Tessalonicenses 5.23, 1 Pedro 1.13-16, 2 Coríntios 3.18, Filipenses 3.12-14 e 1 Coríntios 1.30);",
                en: "The Bible teaches that without sanctification no one will see the Lord. We believe in the doctrine of sanctification as a definite and progressive work of grace, beginning at the moment of regeneration and continuing until the consummation of salvation, respectively (Hebrews 12:14, 1 Thessalonians 5:23, 1 Peter 1:13-16, 2 Corinthians 3:18, Philippians 3:12-14, and 1 Corinthians 1:30);"
            }
        },
        {
            heading: {
                pt: "CREMOS NA CURA DIVINA:",
                en: "WE BELIEVE IN DIVINE HEALING:"
            },
            content: {
                pt: "A cura é para doenças físicas do corpo humano operada pelo poder de Deus através da oração da fé e pela imposição de mãos. Foi providenciada pela expiação de Cristo tornando-se um privilégio de todo cristão hoje (Marcos 16.18, Tiago 5.14-25, 1 Pedro 2.24, Mateus 8.17 e Isaías 53.4-5);",
                en: "Healing is for physical diseases of the human body operated by the power of God through the prayer of faith and the laying on of hands. It was provided by the atonement of Christ, becoming a privilege for every Christian today (Mark 16:18, James 5:14-25, 1 Peter 2:24, Matthew 8:17, and Isaiah 53:4-5);"
            }
        },
        {
            heading: {
                pt: "CREMOS NA FAMÍLIA:",
                en: "WE BELIEVE IN THE FAMILY:"
            },
            content: {
                pt: "Entendemos a família como o núcleo social formado a partir da união entre um homem e uma mulher ou ainda por comunidade formada por qualquer dos pais e seus descendentes (Gênesis 2.24 e Colossenses 3.18-21). Acreditamos no casamento como sendo a união formal entre um homem e uma mulher, perante Deus e perante os homens, com o objetivo de constituir uma família, estabelecendo-se, assim, o vínculo conjugal. Essa união deve ser civilmente reconhecida segundo as disposições legais (Efésios 5.21-33, 1 Pedro 3.7 e 1 Pedro 2.13-14);",
                en: "We understand the family as the social nucleus formed from the union between a man and a woman, or also as a community formed by either parent and their descendants (Genesis 2:24 and Colossians 3:18-21). We believe in marriage as the formal union between a man and a woman, before God and before men, with the purpose of constituting a family, thus establishing the conjugal bond. This union must be civilly recognized according to legal provisions (Ephesians 5:21-33, 1 Peter 3:7, and 1 Peter 2:13-14);"
            }
        },
        {
            heading: {
                pt: "CREMOS NA RESSURREIÇÃO DOS JUSTOS E NA VOLTA DE NOSSO SENHOR:",
                en: "WE BELIEVE IN THE RESURRECTION OF THE RIGHTEOUS AND THE RETURN OF OUR LORD:"
            },
            content: {
                pt: "Os anjos disseram: “O mesmo Jesus voltará da mesma maneira que o vistes subir”. Sua volta é iminente, e quando Ele vier “…os mortos em Cristo ressuscitarão primeiro. Depois nós, os que ficarmos vivos, seremos arrebatados juntamente com eles nas nuvens, a encontrar o Senhor nos ares…” (Atos 1.11 e 1 Tessalonicenses 4.16 -17). Depois da Tribulação Ele voltará a Terra como Rei dos reis e dos sacerdotes e reinará por mil anos (Apocalipse 20.6 e Mateus 24.29-30);",
                en: "The angels said: 'This same Jesus, who has been taken from you into heaven, will come back in the same way you have seen him go into heaven.' His return is imminent, and when He comes '…the dead in Christ will rise first. After that, we who are still alive and are left will be caught up together with them in the clouds to meet the Lord in the air…' (Acts 1:11 and 1 Thessalonians 4:16-17). After the Tribulation, He will return to Earth as King of kings and priests and will reign for a thousand years (Revelation 20:6 and Matthew 24:29-30);"
            }
        },
        {
            heading: {
                pt: "CREMOS NO INFERNO E NO CASTIGO ETERNO:",
                en: "WE BELIEVE IN HELL AND ETERNAL PUNISHMENT:"
            },
            content: {
                pt: "Aquele que morre fisicamente em seus pecados, sem Cristo, está sem esperança e viverá eternamente no Lago de Fogo. Portanto, não haverá mais oportunidade, no futuro, para ouvir o Evangelho do arrependimento. O Lago do Fogo é literal. Os termos “eterno” e “para sempre”, usados para descrever a duração da punição do castigo no Lago de Fogo, trazem o mesmo sentido e significação da existência sem fim que é usada para indicar a duração do gozo e êxtase dos santos na presença de Deus (Hebreus 9.27 e Apocalipse 19.20, 20.11-15).",
                en: "He who physically dies in his sins, without Christ, is without hope and will live eternally in the Lake of Fire. Therefore, there will be no more opportunity in the future to hear the Gospel of repentance. The Lake of Fire is literal. The terms 'eternal' and 'forever,' used to describe the duration of the punishment in the Lake of Fire, carry the same meaning and significance of unending existence that is used to indicate the duration of the joy and ecstasy of the saints in the presence of God (Hebrews 9:27 and Revelation 19:20, 20:11-15)."
            }
        }
    ]
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
          <div class="content-about animate">
           
            <div class="row-text">
              <div class="title animate">
                <Transition name="fade-blur" mode="out-in">
                  <h1 :key="currentLocaleKey"> {{ AboutUs.title?.[locale] }} </h1>
                </Transition>
              </div>
              <div class="about-description">
                <Transition name="fade-blur" mode="out-in">
                  <p :key="currentLocaleKey" >{{ AboutUs.content?.[locale] }}</p>
                </Transition>
              </div>
              <div class="image-about animate px1">
              <Transition name="fade-blur" mode="out-in">
                <img src="/src/assets/IMG_20241029_150219_681.jpg" alt="Me" :key="currentLocaleKey" />
              </Transition>
            </div>
            </div>
          </div>
          <!-- <div class="scrolling-text-container">
            <div class="scrolling-text">
              <span>MISSION & VISION - </span>
              <span>MISSION & VISION - </span>
            </div>
          </div>           -->
          <div class="scrolling-text-container">
            <div class="scrolling-text">
              <div class="scrolling-text-content">
                <span>MISSION & VISION - </span>
                <span>MISSION & VISION - </span>
                <!-- <span>MISSION & VISION - </span>
                <span>MISSION & VISION - </span> -->
              </div>
              <div class="scrolling-text-content">
                <span>MISSION & VISION - </span>
                <span>MISSION & VISION - </span>
                <!-- <span>MISSION & VISION - </span>
                <span>MISSION & VISION - </span> -->
              </div>
            </div>
          </div>
          <div class="content-about animate bg-blue">
            <div class="row-text">
                <div class="column">
                  <div class="cards">
                    <div class="title animate">
                    <Transition name="fade-blur" mode="out-in">
                      <h1 :key="currentLocaleKey">{{ Vision.title?.[locale] }}</h1>
                    </Transition>
                  </div>
                  <div class="about-description">
                    <Transition name="fade-blur" mode="out-in">
                      <p :key="currentLocaleKey" >{{ Vision.content?.[locale] }}</p>
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
            </div>
        </div>
        <div class="content-about">
          <div class="title animate" style="margin-top: 2rem;">
            <Transition name="fade-blur" mode="out-in">
              <h1 :key="currentLocaleKey">{{ Values.title?.[locale] }} </h1>
            </Transition>
          </div>
          <div class="column">              
              <div v-for="v in Values.content" :key="v.order" class="card-values">
                <Transition name="fade-blur" mode="out-in">
                    <p>{{ v.text?.[locale] }}</p> 
                </Transition>
              </div>
            </div>           
          <div class="title animate" style="margin-top: 2rem;">
            <Transition name="fade-blur" mode="out-in">
              <h1 :key="currentLocaleKey"> {{ OurBeliefs.title?.[locale] }} </h1>
            </Transition>
          </div>
          <div class="about-description" v-for="o in OurBeliefs.sections" :key="o">
            <Transition name="fade-blur" mode="out-in">
              <p :key="currentLocaleKey" ><span style="font-style: oblique; font-weight: 800;"> {{ o.heading?.[locale] }}</span> <span>{{ o.content?.[locale] }}</span></p>
            </Transition>
          </div>
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
  /* align-items: flex-start; */
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
}

.image-about{
    display: flex;
    padding: .5 rem;
    justify-content: center;
    align-items: center;
    min-width: 380px !important;
    height: 550px;
    overflow: hidden;
    z-index: 9999;
    position: absolute;
    top:260px;
    left:-170px;
}

.image-about img{
  /* overflow: hidden; */
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
  padding-top: 400px;
  margin-top: -450px;
  padding-bottom: 3rem;
}

/* Animação ao aparecer no scroll */
/* .animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.in-view {
  opacity: 1;
  transform: translateY(0);
} */

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

/* .scrolling-text-container {

  width: 100%;
  overflow: hidden; 
  white-space: nowrap; 
  box-sizing: border-box;
  padding: 500px 0 0 0;
  z-index:100;
}

.scrolling-text {
  display: inline-block;
  width: 100%;
  font-size: 78px;
  animation: scroll-x 15s linear infinite; 
  opacity: .4;
}

.scrolling-text span {
  display: inline-block; 
  margin-right: 50px; 
  font-size: 2em;
  font-weight: bold;
  color: #333;
}

@keyframes scroll-x {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
} */

.scrolling-text-container {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 500px 0 0 0;
  z-index: 100;
  position: relative;
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
    margin-top: -300px;
    padding-top: 300px !important;
    padding-bottom: 2rem !important;
  }


}

</style>
