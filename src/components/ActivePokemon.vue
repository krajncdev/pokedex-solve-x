<script setup lang="ts">
import { usePokemonStore } from '@/stores/pokemon';
import HeightIcon from './icons/Height.vue';
import WeightIcon from './icons/Weight.vue';
import Sprites from './Sprites.vue';
import { capitalize } from 'vue';
import AbilityTable from './AbilityTable.vue';

const store = usePokemonStore();
</script>

<template>
  <section class="grid grid-cols-2 gap-10">
    <div class="flex h-80 relative justify-center items-center">
      <div class="absolute top-0 -left-32 h-80 w-80">
        <div class="relative flex items-center justify-center">
          <HeightIcon />
          <p class="absolute ml-4">
            {{ store.activePokemon ? store.activePokemon.height : '?' }}cm
          </p>
        </div>
      </div>
      <div
        class="relative flex justify-center items-center w-20 self-start mt-7"
      >
        <WeightIcon />
        <p class="absolute mt-4">
          {{ store.activePokemon ? store.activePokemon.weight : '?' }}kg
        </p>
      </div>
      <div
        class="border-2 border-black rounded-full w-64 h-64 p-4 flex justify-center items-center"
      >
        <img
          v-if="store.activePokemon"
          :src="
            store.activePokemon.sprites.other['official-artwork'].front_default
          "
          :alt="store.activePokemon.name"
        />
        <p v-if="!store.activePokemon">?</p>
      </div>

      <Sprites />
    </div>

    <div>
      <h1 class="text-2xl font-semibold">
        {{
          store.activePokemon
            ? capitalize(store.activePokemon.name.split('-').join(' '))
            : 'Pokemon name'
        }}
      </h1>
      <ul class="flex gap-2 mt-2" v-if="store.activePokemon">
        <li
          v-for="type in store.activePokemon.types"
          class="border-2 border-solid border-black rounded-md px-2 py-1"
        >
          {{ capitalize(type.type.name) }}
        </li>
      </ul>

      <AbilityTable />
    </div>
  </section>
</template>
