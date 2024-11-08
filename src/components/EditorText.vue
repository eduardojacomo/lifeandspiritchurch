<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
// import { useEmit } from './emit.js'; // Importe useEmit se estiver utilizando um módulo separado para emitir eventos

const writingArea = ref(null);
const textHandle = ref('teste');

const emit = defineEmits(['update']);
const emitContent = () => {
    if (writingArea.value) {
        emit('update', writingArea.value.innerHTML);
    }
};

const formatOptions = [
  { id: 'bold', icon: 'fa-solid fa-bold' },
  { id: 'italic', icon: 'fa-solid fa-italic' },
  { id: 'underline', icon: 'fa-solid fa-underline' },
  { id: 'strikethrough', icon: 'fa-solid fa-strikethrough' },
  { id: 'insertOrderedList', icon: 'fa-solid fa-list-ol' },
  { id: 'insertUnorderedList', icon: 'fa-solid fa-list-ul' },
  { id: 'justifyLeft', icon: 'fa-solid fa-align-left' },
  { id: 'justifyCenter', icon: 'fa-solid fa-align-center' },
  { id: 'justifyRigth', icon: 'fa-solid fa-align-right' },
  { id: 'justifyFull', icon: 'fa-solid fa-align-justify' }
];

const colors = [
    {label:"Transparente", value:"transparent", tema:"dark"},
    {label:"Preto", value:"#181818", tema:"dark"},
    {label:"Branco", value:"#f2f2f2", tema:"dark"},
    {label:"Cinza", value:"#808080", tema:"dark"},
	{label:"Cinza", value:"#B3B3B3", tema:"light"},
	{label:"Azul", value:"#3399FF", tema:"dark"},
	{label:"Azul", value:"#0066CC", tema:"light"},
	{label:"Verde", value:"#66CC66", tema:"dark"},
	{label:"Verde", value:"#33AA33", tema:"light"},
	{label:"Amarelo", value:"#FFCC33", tema:"dark"},
	{label:"Amarelo", value:"#FFD700", tema:"light"},
	{label:"Laranja", value:"#FF9933", tema:"dark"},
	{label:"Laranja", value:"#FF8800", tema:"light"},
	{label:"Vermelho", value:"#FF6666", tema:"dark"},
	{label:"Vermelho", value:"#CC3333", tema:"light"},
	{label:"Roxo", value:"#B266FF", tema:"dark"},
	{label:"Roxo", value:"#9933CC", tema:"light"},
	{label:"Marrom", value:"#CD853F", tema:"dark"},
	{label:"Marrom", value:"#A0522D", tema:"light"},
]

const fontSizes = [1, 2, 3, 4, 5, 6, 7];
const fontList = ["Arial", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];

const selectedFont = ref(fontList[0]);
const selectedFontSize = ref(fontSizes[2]);
const showHighlighter = ref(false);
const showFill = ref(false);

const applyColor = (color, id) => applyCommand(id, color);
const applyFontSizeChange = () => applyCommand('fontSize', selectedFontSize.value);
const applyFontChange = () => applyCommand('fontName', selectedFont.value);
const applyCommand = (command, value = null) => {
  document.execCommand(command, false, value)
}


onMounted(() => {
  applyFontChange();  
  applyFontSizeChange();
  writingArea.value.addEventListener('blur', emitContent);
})

onBeforeUnmount(() => {
    writingArea.value.removeEventListener('blur', emitContent);
});
</script>


<template>
    <div class="container">
        <div class="container-editor">

            <div class="toolbar">
    
                <button v-for="format in formatOptions" :key="format.id" :id="format.id" @click="applyCommand(format.id)" class="options format" >
                    <font-awesome-icon :icon="format.icon" />   
                </button>
    
                <select v-model="selectedFont" @change="applyFontChange" class="adv-option-button" >
                    <option v-for="font in fontList" :key="font" :value="font">{{ font }}</option>
                </select>
    
       
                <select v-model="selectedFontSize" @change="applyFontSizeChange" class="adv-option-button" >
                    <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
                </select>
                
                <button class="options" id="highlighter" @click="showHighlighter =!showHighlighter" >
                    <font-awesome-icon icon="fa-solid fa-highlighter"/>
                    <div class="showColors" v-if="showHighlighter">
                        <div v-for="(c,index) in colors" :key="index">
                            <button class="colors" :style="{
                                    backgroundColor: c.value,
                                    border: c.value === 'transparent' ? 'solid 1px var(--color-border)' : 'none',
                                    justifyContent: 'center', alignItems: center
                                }" @click="applyColor(c.value, 'forecolor')">
                            <font-awesome-icon icon="fa-solid fa-ban" v-if="c.value === 'transparent'" />    
                            </button>
                        </div>
                    </div>
                </button>
                <button class="options" id="fill" @click="showFill =! showFill">
                    <font-awesome-icon icon="fa-solid fa-fill-drip" />
                    <div class="showColors" v-if="showFill">
                        <div v-for="(c,index) in colors" :key="index">
                            <button class="colors" :style="{
                                    backgroundColor: c.value,
                                    border: c.value === 'transparent' ? 'var(--color-border)' : 'none'
                                }" :class="c.tema" @click="applyColor(c.value, 'forecolor')">
                            <font-awesome-icon icon="fa-solid fa-ban" v-if="c.value === 'transparent'" />    
                            </button>
                        </div>
                    </div>
                </button>
            </div>
    
            <div >
                <div ref="writingArea" id="text-input" contenteditable="true" class="text-area-content" ></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-editor{
    display: flex;
    flex-direction: column;
    border: solid 1px var(--color-border);
    /* border-radius: 16px; */
    /* background-color: var(--color-background-mute); */
    padding: 5px;
}

/* #text-input {
  margin-top: 10px;
  border: 1px solid #dddddd;
  padding: 20px;
  height: 50vh;
} */

.toolbar{
    /* border-bottom: solid 1px var(--color-text); */
    border: none;
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 5px;
}
.options{
    padding: 8px;
    background-color: transparent;
    color: var(--color-text);
    cursor: pointer;
    border: none;
    border-radius: 8px;
    position: relative;
}

.options:hover{
    background-color: var(--color-background-soft);
}

.text-area-content {
    padding: 10px 10px;
    /* margin-top: 10px; */
    border: none;
    width: clamp(350px, 100%, 750px);
    max-width: 750px;           
    height: 400px;
    overflow-y: auto;
    overflow-x: auto;           
    white-space: pre-wrap;      
    word-break: break-word;     
    overflow-wrap: break-word;  
    
}

.text-area-content:focus{
    outline: none;
    box-shadow: none;
}

.show {
    color: var(--color-text);
}

.showColors{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 110px;
    height: auto;
    border: solid 1px var(--color-border);
    border-radius: 8px;
    padding: 10px;
    gap: 10px;
    background-color: var(--color-background-soft);
    position: absolute;
    top: 30px;
    left: 5px;
    z-index: 1000;
    justify-content: center;
}

.showColors button{
   display: flex;
   justify-content: center;
   align-items: center;
}

.colors{
    width: 20px;
    height: 20px;
    border: none;
    cursor: pointer;
    background-color: transparent;
}
</style>