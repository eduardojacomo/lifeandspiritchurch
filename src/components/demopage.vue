<template>
  <div class="app">
    <EventDetail :event="eventData" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EventDetail from '../views/EventDetailView.vue';

const eventData = ref({
  id: 1,
  title: "Conferência Anual 2026",
  subtitle: "Um encontro transformador de fé, adoração e comunhão",
  category: "CONFERÊNCIA",
  status: "ATIVO",
  date: new Date(2026, 2, 15), // 15 de Março de 2026
  time: "19:00 - 22:00",
  location: "Templo Central",
  address: "Av. Principal, 1000 - Centro, Rio de Janeiro - RJ",
  image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200",
  capacity: 500,
  registrations: 342,
  description: `
    <p>Junte-se a nós para uma noite inesquecível de adoração, ensino da Palavra e comunhão. A <strong>Conferência Anual 2026</strong> promete ser um marco espiritual em nossas vidas.</p>
    
    <p>Este evento especial reunirá membros de toda a região para três dias intensos de renovação espiritual, workshops práticos e momentos de profunda adoração. Prepare seu coração para receber uma palavra transformadora!</p>
    
    <p>Contaremos com ministros renomados, músicos talentosos e uma atmosfera preparada pelo Espírito Santo. Não perca esta oportunidade de crescer em sua fé e conectar-se com irmãos de toda a região.</p>
    
    <p><strong>Traga sua família e amigos!</strong> Haverá atividades especiais para crianças e adolescentes, além de um espaço dedicado para oração e aconselhamento espiritual.</p>
  `,
  speakers: [
    {
      id: 1,
      name: "Pastor João Silva",
      role: "Pregador Principal",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    {
      id: 2,
      name: "Pastora Maria Santos",
      role: "Ministra de Adoração",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
    },
    {
      id: 3,
      name: "Pr. Carlos Oliveira",
      role: "Ministério Jovem",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    }
  ],
  schedule: [
    {
      time: "19:00",
      title: "Abertura e Louvor",
      description: "Momento de adoração e boas-vindas"
    },
    {
      time: "19:45",
      title: "Palavra Introdutória",
      description: "Pastor João Silva"
    },
    {
      time: "20:30",
      title: "Mensagem Principal",
      description: "Tema: 'Fé que Transforma'"
    },
    {
      time: "21:15",
      title: "Ministração",
      description: "Momento de oração e ministração pessoal"
    },
    {
      time: "21:45",
      title: "Encerramento",
      description: "Avisos e bênção final"
    }
  ],
  tags: ["Conferência", "Adoração", "Comunhão", "FeQueTransforma", "Igreja2026"]
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Work Sans', sans-serif;
  background: #0a0a0a;
  color: #ffffff;
}

.app {
  min-height: 100vh;
}
</style>