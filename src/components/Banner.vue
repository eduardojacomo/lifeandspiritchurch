<script setup>
  import TextEffect from '@/components/Tools/TextEffect.vue';
  
</script>

<template>
  <main>
    <div class="banner">
       <div class="socials">
            <div class="linha-vertical"></div>
            <!-- <a href=""><font-awesome-icon icon="fa-brands fa-instagram" /></a>  -->
            <a href="https://www.linkedin.com/in/eduardojacomo/" target="_blank"><i class="devicon-linkedin-plain"></i></a> 
            <a href="https://github.com/eduardojacomo/" target="_blank"><i class="devicon-github-original"></i></a>         
       </div>
       <div class="content">
           <div class="text_content">
                <div class="text">
                    <h1>Eduardo Jácomo</h1>
                    <TextEffect :words="['Developer', 'FullStack', 'Freelancer']"/>
                </div>
           </div>
           <div class="image-content"></div>
       </div>
       
        <div class="vertical">
            <a href="#about" class="botao-scroll"><span>SAIBA MAIS</span><font-awesome-icon icon="fa-solid fa-arrow-right" /></a>
        </div>
    </div>
  </main>
</template>

<style scoped>
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
    background-image: url("/src/assets/me.webp");
    overflow: hidden;
    opacity: 0.6;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: left;
    height: 88vh;
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
</style>
