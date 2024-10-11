<template>
    <div class="text">
      <h2>
          
            <span
              v-for="(word, index) in props.words"
              :key="index"
              class="word"
              ref="wordRefs"
              style="opacity: 0"
            >
              {{ word }}
            </span>
          
      </h2>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, onBeforeMount } from 'vue';
  const words = ref([]);
  const props = defineProps({
  words: {
    type: Array,
    required: true,
  },
});
  
  const wordArray = ref([]);
  let currentWord = ref(0);
  const wordRefs = ref([]);
  
  // Split letters into spans
  const splitLetters = (wordElement) => {
    const content = wordElement.innerHTML;
    wordElement.innerHTML = '';
    const letters = [];
    for (let i = 0; i < content.length; i++) {
      const letter = document.createElement('span');
      letter.className = 'letter';
      letter.innerHTML = content.charAt(i);
      wordElement.appendChild(letter);
      letters.push(letter);
    }
    wordArray.value.push(letters);
  };
  
  // Change the word
  const changeWord = () => {
    const cw = wordArray.value[currentWord.value];
    const nw = currentWord.value === wordArray.value.length - 1 ? wordArray.value[0] : wordArray.value[currentWord.value + 1];
  
    if (!cw || !nw) return; // Prevent errors if undefined
  
    cw.forEach((letter, i) => {
      animateLetterOut(cw, i);
    });
  
    nw.forEach((letter, i) => {
      letter.className = 'letter behind';
      animateLetterIn(nw, i);
    });
  
    currentWord.value = (currentWord.value === wordArray.value.length - 1) ? 0 : currentWord.value + 1;
  };
  
  // Animate letter out
  const animateLetterOut = (cw, i) => {
    setTimeout(() => {
      cw[i].className = 'letter out';
      // Fade out
      setTimeout(() => {
        cw[i].style.opacity = 0; // Set opacity to 0 when animating out
      }, 320); // Match this to the animation duration
    }, i * 80);
  };
  
  // Animate letter in
  const animateLetterIn = (nw, i) => {
    setTimeout(() => {
      nw[i].className = 'letter in';
      // Fade in
      nw[0].parentElement.style.opacity = 1; // Ensure the word is visible
      nw[i].style.opacity = 1; // Set opacity to 1 when animating in
    }, 340 + (i * 80));
  };
  
  // Initialize the component
  onMounted(() => {
    nextTick(() => {
      wordRefs.value = document.getElementsByClassName('word');
  
      if (wordRefs.value.length > 0) {
        wordRefs.value[currentWord.value].style.opacity = 1;
  
        for (let i = 0; i < wordRefs.value.length; i++) {
          splitLetters(wordRefs.value[i]);
        }
  
        changeWord();
        setInterval(changeWord, 5000);
      }
    });
  });

  onBeforeMount(() => {
    words.value = props.words;
    console.log(words.value);
  });
  </script>
  
  <style scoped>
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:600);
  
  body {
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    font-size: 40px;
    background-color:var(--color-backgroud); /* Set background color for visibility */
    color: var(--color-heading);
  }
    
  p {
    display: inline-block;
    vertical-align: top;
    margin: 0;
  }
  
  .word {
    position: absolute;
    width: 220px;
    opacity: 0; /* Start hidden */
    transition: opacity 0.3s ease; /* Add transition for opacity */
  }
  
  .letter {
    display: inline-block;
    position: relative;
    float: left;
    transform: translateZ(25px);
    transform-origin: 50% 50% 25px;
  }
  
  .letter.out {
    transform: rotateX(90deg);
    transition: transform 0.32s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  
  .letter.behind {
    transform: rotateX(-90deg);
  }
  
  .letter.in {
    transform: rotateX(0deg);
    transition: transform 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  </style>
  