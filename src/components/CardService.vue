<script setup>
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
        type: String,
        required: true
        }
    });
</script>

<template>
    <div class="card-container">
        <div class="card-icon">
            <font-awesome-icon :icon="props.icon" />
        </div>
        <div class="card-title">
            {{ props.title }}
        </div>
        <div class="card-content">
            {{props.content}}
        </div>
    </div>
</template>


<style scoped>
    .card-container{
        display: flex;
        flex-direction: column;
        gap: .5rem;
        border: solid 1px var(--color-border);
        background-color: var(--color-background-mute);
        padding: 1rem;
        width: 350px;
        height: 280px;
    }
    .card-icon{
        background-color: rgba(122, 177, 122, 0.7);
        width: 60px;
        height: 60px;
        border: none;
        border-radius: 50%;
        padding: 1rem;
    }
</style>