<script setup lang="ts">
import './assets/main.css';
import { onMounted } from 'vue';
import { usePokemonStore } from './stores/pokemon';
import Search from './components/Search.vue';
import RandomIcon from './components/icons/Random.vue';
import ActivePokemon from './components/ActivePokemon.vue';
import CustomizePokemon from './components/CustomizePokemon.vue';

const store = usePokemonStore();

const handleRandomButtonClick = async () => {
  const randomNumber = store.allPokemon
    ? Math.floor(Math.random() * store.allPokemon?.count) + 1
    : 0;
  const response = await store.changeActivePokemon(
    `https://pokeapi.co/api/v2/pokemon/${randomNumber}`
  );
  if (response === -1) handleRandomButtonClick();
  store.closeIsSelectOpen();
};

const testFunction = () => {
  console.log('button', store.customPokemon);
};

onMounted(async () => {
  store.addAllPokemon();
});
</script>

<template>
  <div class="flex justify-center">
    <div class="w-[1024px] my-10">
      <header class="flex gap-4">
        <Search />
        <button
          class="h-10 w-10 flex items-center justify-center rounded-md border-2 border-black border-solid"
          @click="handleRandomButtonClick"
        >
          <RandomIcon />
        </button>
      </header>
      <main>
        <ActivePokemon />
        <CustomizePokemon />

        <button
          @click="testFunction()"
          class="border-2 border-black border-solid px-4 py-1.5 rounded-md"
        >
          Test custom pokemon
        </button>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
