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
    width: 110px;
    height: 90px;
    padding: 10px;
    border: none;
    background-color: transparent;
    text-align: center;
    align-content: center;
    justify-content: center;
}

.card i{
    font-size: 2.5rem;
}
</style>