<script setup lang="ts">
import { computed, ref } from 'vue';
import ArrowLeftIcon from './icons/ArrowLeft.vue';
import { usePokemonStore } from '@/stores/pokemon';

const store = usePokemonStore();

const activeSpriteIndex = ref(0);
const allSprites = computed(() => {
  if (store.activePokemon?.sprites.front_default) {
    const sprites = <string[]>[store.activePokemon?.sprites.front_default];
    for (let key in store.activePokemon?.sprites.versions) {
      for (let unknown in store.activePokemon.sprites.versions[key]) {
        store.activePokemon.sprites.versions[key][unknown].front_default !==
          null &&
          sprites.push(
            store.activePokemon.sprites.versions[key][unknown].front_default
          );
      }
    }
    return sprites;
  }
  return [];
});
console.log(allSprites.value);

const handleButtonNext = () => {
  if (activeSpriteIndex.value === allSprites.value.length - 1)
    activeSpriteIndex.value = 0;
  else activeSpriteIndex.value++;
};

const handleButtonPrevious = () => {
  if (activeSpriteIndex.value === 0)
    activeSpriteIndex.value = allSprites.value.length - 1;
  else activeSpriteIndex.value--;
};
</script>

<template>
  <div class="flex gap-2 absolute bottom-0 right-0 items-center">
    <button
      @click="handleButtonPrevious"
      class="w-8 h-8 flex"
      :class="
        allSprites.length > 1
          ? 'fill-black'
          : 'fill-black/20 cursor-not-allowed'
      "
    >
      <ArrowLeftIcon />
    </button>

    <div
      class="border-solid border-2 border-black rounded-full h-12 w-12 overflow-hidden flex justify-center items-center"
    >
      <p v-if="allSprites.length === 0">?</p>
      <img
        v-if="allSprites.length > 0"
        :src="allSprites[activeSpriteIndex]"
        :alt="store.activePokemon?.name"
        class="relative object-contain rounded-full -z-10 h-auto w-auto"
      />
    </div>

    <button
      @click="handleButtonNext"
      class="w-8 h-8 rotate-180 flex fill-black"
      :class="
        allSprites.length > 1
          ? 'fill-black'
          : 'fill-black/20 cursor-not-allowed'
      "
    >
      <ArrowLeftIcon />
    </button>
  </div>
</template>
