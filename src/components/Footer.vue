<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale: i18nLocale } = useI18n();

const route = useRoute();

</script>

<template>
    <main>
        <div class="content-footer">
            <div class="column">
                <div class="row logo">
                    <img src="/src/assets/logo.png" alt="">
                </div>
                <div class="row">
                    <nav>
                        <ul>
                            <li><router-link class="nav_menu" to="/" @click="closeMenu">{{ t('_nav._home') }}</router-link></li>
                            <li><router-link class="nav_menu" to="/#about" @click="closeMenu">{{ t('_nav._about') }}</router-link></li>
                            <li><router-link class="nav_menu" to="/#services" @click="closeMenu">{{ t('_nav._ministries') }}</router-link></li>
                            <li><router-link class="nav_menu" to="/#portfolio" @click="closeMenu">{{ t('_nav._scheadle') }}</router-link></li>
                            <li><router-link class="nav_menu" to="/#contact" @click="closeMenu">{{ t('_nav._contact') }}</router-link></li>
                        </ul>
                    </nav>
                </div>
                <div class="row">
                    <div class="icons">
                        <Transition name="fade-blur" mode="out-in">
                        <a href="https://www.instagram.com/lifeandspiritchurch1" target="_blank" :key="currentLocaleKey">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"><!-- Icon from CoreUI Brands by creativeLabs Łukasz Holeczek - https://creativecommons.org/publicdomain/zero/1.0/ --><path fill="currentColor" d="M16 0c-4.349 0-4.891.021-6.593.093c-1.709.084-2.865.349-3.885.745a7.85 7.85 0 0 0-2.833 1.849A7.8 7.8 0 0 0 .84 5.52C.444 6.54.179 7.696.095 9.405c-.077 1.703-.093 2.244-.093 6.593s.021 4.891.093 6.593c.084 1.704.349 2.865.745 3.885a7.85 7.85 0 0 0 1.849 2.833a7.8 7.8 0 0 0 2.833 1.849c1.02.391 2.181.661 3.885.745c1.703.077 2.244.093 6.593.093s4.891-.021 6.593-.093c1.704-.084 2.865-.355 3.885-.745a7.85 7.85 0 0 0 2.833-1.849a7.7 7.7 0 0 0 1.849-2.833c.391-1.02.661-2.181.745-3.885c.077-1.703.093-2.244.093-6.593s-.021-4.891-.093-6.593c-.084-1.704-.355-2.871-.745-3.885a7.85 7.85 0 0 0-1.849-2.833A7.7 7.7 0 0 0 26.478.838c-1.02-.396-2.181-.661-3.885-.745C20.89.016 20.349 0 16 0m0 2.88c4.271 0 4.781.021 6.469.093c1.557.073 2.405.333 2.968.553a5 5 0 0 1 1.844 1.197a4.9 4.9 0 0 1 1.192 1.839c.22.563.48 1.411.553 2.968c.072 1.688.093 2.199.093 6.469s-.021 4.781-.099 6.469c-.084 1.557-.344 2.405-.563 2.968c-.303.751-.641 1.276-1.199 1.844a5.05 5.05 0 0 1-1.844 1.192c-.556.22-1.416.48-2.979.553c-1.697.072-2.197.093-6.479.093s-4.781-.021-6.48-.099c-1.557-.084-2.416-.344-2.979-.563c-.76-.303-1.281-.641-1.839-1.199c-.563-.563-.921-1.099-1.197-1.844c-.224-.556-.48-1.416-.563-2.979c-.057-1.677-.084-2.197-.084-6.459c0-4.26.027-4.781.084-6.479c.083-1.563.339-2.421.563-2.979c.276-.761.635-1.281 1.197-1.844c.557-.557 1.079-.917 1.839-1.199c.563-.219 1.401-.479 2.964-.557c1.697-.061 2.197-.083 6.473-.083zm0 4.907A8.21 8.21 0 0 0 7.787 16A8.21 8.21 0 0 0 16 24.213A8.21 8.21 0 0 0 24.213 16A8.21 8.21 0 0 0 16 7.787m0 13.546c-2.948 0-5.333-2.385-5.333-5.333s2.385-5.333 5.333-5.333s5.333 2.385 5.333 5.333s-2.385 5.333-5.333 5.333M26.464 7.459a1.923 1.923 0 0 1-1.923 1.921a1.919 1.919 0 1 1 0-3.838c1.057 0 1.923.86 1.923 1.917"/></svg>
                        </a> 
                        </Transition>
                        <Transition name="fade-blur" mode="out-in">
                        <a href="https://www.youtube.com/@lifespiritchurch" target="_blank" :key="currentLocaleKey">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"><!-- Icon from CoreUI Brands by creativeLabs Łukasz Holeczek - https://creativecommons.org/publicdomain/zero/1.0/ --><path fill="currentColor" d="M31.328 8.271a4 4 0 0 0-2.787-2.781c-2.495-.667-12.525-.667-12.525-.667S6.005 4.807 3.484 5.49A4 4 0 0 0 .703 8.271a41.6 41.6 0 0 0-.697 7.745a42 42 0 0 0 .697 7.708a4.02 4.02 0 0 0 2.781 2.787c2.495.667 12.532.667 12.532.667s10.005 0 12.525-.667a4.02 4.02 0 0 0 2.787-2.787c.459-2.541.683-5.125.667-7.708c.016-2.6-.203-5.188-.667-7.745M12.812 20.803v-9.595l8.349 4.808z"/></svg>
                        </a>
                        </Transition>
                        <Transition name="fade-blur" mode="out-in">
                        <a href="https://www.facebook.com/lifeandspiritchurch1/" target="_blank" :key="currentLocaleKey">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"><!-- Icon from CoreUI Brands by creativeLabs Łukasz Holeczek - https://creativecommons.org/publicdomain/zero/1.0/ --><path fill="currentColor" d="M32 16c0-8.839-7.167-16-16-16C7.161 0 0 7.161 0 16c0 7.984 5.849 14.604 13.5 15.803V20.626H9.437v-4.625H13.5v-3.527c0-4.009 2.385-6.223 6.041-6.223c1.751 0 3.584.312 3.584.312V10.5h-2.021c-1.984 0-2.604 1.235-2.604 2.5v3h4.437l-.713 4.625H18.5v11.177C26.145 30.603 32 23.983 32 15.999z"/></svg>
                        </a>
                        </Transition>
                    </div>
                </div>
                <div class="row">
                    <div class="row adress">
                        <p>Life & Spirit Church - Clemorris</p>
                        <p>Lakeside Retail Park, Unit 13 Ballindine Road, Clare, Claremorris, Co. Mayo, Irlanda</p>
                        <p>+353 89 450 7333</p>

                    </div>
                </div>
            </div>
            <div class="row" style="align-items: center;">
                <p>todos os direitos reservardos</p>
            </div>
        </div>
    </main>    
</template>

<style scoped>

    .column{
        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0 2rem;
    }

    .row, .content-footer{
        display: flex;
        flex-direction: column;
    }

    .content-footer{
        gap: 1rem;
        background-color: var(--color-background-soft);
        padding: 2rem;
    }

    li a{
        text-decoration: none;
        color: var(--color-text);
        font-size: 1rem;
        cursor: pointer;
    }

    li a:hover{
        color: var(--color-heading);
    }

    .logo{
        width: 150px;
        overflow: hidden;
    }

    .logo img{
        width: 100%;
        object-fit: contain;
    }

    ul{
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: .5rem;
        flex-direction: column;
    }

    .icons{
        display: flex;
        flex-direction: column;
        color: var(--color-text);
        justify-content: space-evenly;
        font-size: 1.5rem;
        gap: .5rem;
    }

    .icons a{
        text-decoration: none;
        color: var(--color-text);
    }
    .adress{
        width: 350px;
        gap: .5rem
    }

    @media screen and (max-width: 768px){
        .column{
            flex-direction: column;
        }
    }

</style>