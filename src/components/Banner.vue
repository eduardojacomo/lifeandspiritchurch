<script setup>
  import TextEffect from '@/components/Tools/TextEffect.vue';
  
</script>

<template>
  <main>
    <div class="banner">
       <div class="socials">
            <div class="linha-vertical"></div>
            <a href=""><font-awesome-icon icon="fa-brands fa-instagram" /></a> 
            <a href=""><font-awesome-icon icon="fa-brands fa-linkedin" /></a> 
            <a href=""><font-awesome-icon icon="fa-brands fa-github"/></a>         
       </div>
       <div class="content">
           <div class="text_content">
                <div class="text">
                    <h1>Eduardo Jácomo</h1>
                    <TextEffect :words="['Developer', 'FullStack', 'Freelancer']"/>
                </div>
           </div>
           <div class="image-content"> </div>
       </div>
       
        <div class="vertical">
            <a href="#about" class="botao-scroll"><span>SAIBA MAIS</span><font-awesome-icon icon="fa-solid fa-arrow-right" /></a>
        </div>
    </div>
  </main>
</template>

<style scoped>
.banner{
    display: flex;
    gap: .5rem;
    height: auto;
    width: 100%;
    padding: 70px 2rem .5rem 2rem;
    position: relative;
}
.content{
    display: flex;
    width: 90%;
    flex-direction: row;
}
.socials, .right-side{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: .5rem;
    padding: 0 0 .5rem 1rem;
    font-size: 1.2rem;
}

.socials a{
    text-decoration: none;
    color: var(--color-text);
    cursor: pointer;
}

.socials a:hover{
    color: var(--color-heading);
}

.text_content{
    display: flex;
    flex-direction: column;
    width: 500px;
    justify-content: center;
    align-content: center;
    width: 100%;
    align-items: center;
    
}

.text_content h1{
    font-family: "Poppins", sans-serif;
    font-weight: 700;
    font-style: normal;
    font-weight: 700;
    font-size: 36px;
    color: var(--color-heading);
}

.linha-vertical {
    border-left: 2px solid var(--color-text); /* Define a borda esquerda */
    height: 180px; /* Define a altura da linha */
    margin: 0 0 0 8px;
}

.text{
    display: flex;
    flex-direction: column;    
}

.image-content {
    display: flex;
    width: 70%;
    background-image: url("/src/assets/me.png");
    overflow-x: hidden;
    overflow-y: hidden;
    opacity: 0.6;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right;
    height: 88vh;
}

.vertical{  
    position: absolute;
    bottom: 50px;
    right: 20px;
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
    font-size: .9rem;
    color: var(--color-text);
    border: none;
    cursor: pointer;
    animation: moverVertical 2s infinite alternate; /* Animação vertical */
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
</style>