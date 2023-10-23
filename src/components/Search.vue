<script setup lang="ts">
import { usePokemonStore } from '@/stores/pokemon';
import { ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';

const store = usePokemonStore();
const inputPokemon = ref('');
const ulRef = ref(null);

// on click outside ul
onClickOutside(ulRef, (_) => store.closeIsSelectOpen());

const handleButtonClick = (url: string) => {
  store.changeActivePokemon(url);
  store.closeIsSelectOpen();
};

watch(inputPokemon, () => {
  store.changeShowedPokemon(inputPokemon.value);
});
</script>

<template>
  <div class="relative w-96">
    <input
      @click="store.openIsSelectOpen()"
      v-model="inputPokemon"
      class="w-full rounded-md border-black border-2 border-solid px-2 py-1.5 outline-none z-20 relative"
      placeholder="Search your pokemon!"
    />
    <ul
      v-if="store.isSelectOpen && inputPokemon !== ''"
      ref="ulRef"
      class="absolute z-10 w-full max-h-44 -mt-1 overflow-y-scroll bg-white flex flex-col items-center border-l-2 border-r-2 border-b-2 border-solid border-orange rounded-b-md"
    >
      <li
        v-for="pokemon in store.showedPokemon"
        class="w-full border-b-2 border-orange/30 border-solid"
      >
        <button class="p-2 w-full" @click="handleButtonClick(pokemon.url)">
          {{ pokemon.name }}
        </button>
      </li>
    </ul>
  </div>
</template>
