<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

  const props = defineProps({
        icon: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: Object,
            required: true
        },
        link: {
            type: String,
            required: false
        }
    });
</script>

<template>
    <div class="card-container">
        <!-- <div class="position-icon">
            <div class="card-icon">
                <font-awesome-icon :icon="props.icon" />
            </div>
        </div> -->
        <div class="card-title">
            <h2>{{ props.title }} </h2>
        </div>
        <div class="card-content">
            <p> {{props.content.day}}</p>
            <p> {{props.content.hour}}</p>
        </div>
        <!--<div class="card-link">
            <router-link :to="`/Service/${props.link}`" class="custom-link">{{ t('_link._more') }}</router-link>
        </div>-->
    </div>
</template>


<style scoped>
    .card-container{
        display: flex;
        flex-direction: column;
        /* gap: .2rem; */
        border: solid 1px var(--color-border);
        /* border-radius: 8px; */
        background-color: transparent;
        padding: 1rem 2rem;
        width: 200px;
        height: 280px;
    }
    .card-icon{
        background-color: rgba(122, 177, 122, 0.7);
        display: flex;
        width: 60px;
        height: 60px;
        border: none;
        border-radius: 50%;
        padding: 1rem;
        font-size: 1.5rem;
        align-items: center;
        justify-content: center;
    }

    .card-title{
        display: flex;
        padding: .5rem 0 0 0;
        color: var(--color-heading);
    }

    .card-content{
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        height: 120px;
        padding: 1rem 0 0 0;
        /* flex: 1 0 380px; */
    }
    .position-icon{
        display: flex;
        width: 100%;
        justify-content: flex-end;
    }
    .custom-link{
        text-decoration: none;
        cursor: pointer;
        display: flex;
        color: var(--color-text);
        transition: color ease .5s;
    }

    .custom-link:hover{
        color: var(--color-heading);
    }
    .card-link{
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
</style>