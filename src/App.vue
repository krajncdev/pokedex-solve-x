<script setup lang="ts">
import './assets/main.css';
import { onMounted } from 'vue';
import { usePokemonStore } from './stores/pokemon';
import Search from './components/Search.vue';
import RandomIcon from './components/icons/Random.vue';
import ActivePokemon from './components/ActivePokemon.vue';
import CustomizePokemon from './components/CustomizePokemon.vue';

const store = usePokemonStore();

const handleRandomButtonClick = () => {
  const lastElement =
    store.allPokemon?.results[store.allPokemon.results.length - 1];
  const lastElementIndex = Number(
    lastElement?.url.split('/')[lastElement.url.split('/').length - 2]
  );
  const randomNumber = lastElementIndex
    ? Math.floor(Math.random() * lastElementIndex) + 1
    : 0;
  const link = `https://pokeapi.co/api/v2/pokemon/${randomNumber}`;
  const check: boolean | undefined = store.allPokemon?.results.some((p) =>
    p.url.includes(link)
  );
  if (check) {
    store.changeActivePokemon(link);
    store.closeIsSelectOpen();
    return 0;
  }
  handleRandomButtonClick();
  // console.log('bad link: ', link);
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
          class="h-10 w-10 flex items-center justify-center rounded-md border-2 border-black border-solid fill-white bg-orange"
          @click="handleRandomButtonClick"
        >
          <RandomIcon />
        </button>
      </header>
      <main>
        <ActivePokemon />
        <CustomizePokemon />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
