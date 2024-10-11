<script setup>
    const props = defineProps({
        icon: {
        type: String,
        required: true
        },
        label: {
        type: String,
        required: true
        },
    })
</script>

<template>
    <div class="card">
        <i :class="props.icon"></i>
        <span>{{props.label}}</span>
    </div>
</template>

<style scoped>
.card{
    display: flex;
    flex-direction: column;
    width: 120px;
    height: 120px;
    padding: 10px;
    border: solid 1px var(--color-border);
    /* border: none; */
    border-radius: 8px;
    /* background-color: var(--color-background-mute); */
    background-color: transparent;
    text-align: center;
    align-content: center;
}

.card i{
    font-size: 4rem;
}
</style>