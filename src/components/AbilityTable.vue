<script setup lang="ts">
import { getData } from '@/config/helpers';
import type { IAllPokemonAbilities, IPokemonAbility } from '@/config/types';
import { usePokemonStore } from '@/stores/pokemon';
import { capitalize, computed } from 'vue';
import { onMounted, ref, watch } from 'vue';

const store = usePokemonStore();
const abilities = ref<IAllPokemonAbilities[]>([]);

onMounted(async () => {
  fetchAbilities();
});

watch(
  () => store.activePokemon,
  (newActivePokemon) => {
    if (newActivePokemon) {
      fetchAbilities();
    }
  }
);

// const abilitiesTest = computed(() => fetchAbilities());

async function fetchAbilities() {
  const allAbilities: IAllPokemonAbilities[] = [];
  if (store.activePokemon) {
    for (const ability of store.activePokemon.abilities) {
      if (ability.ability.name === 'Custom') {
        allAbilities.push({
          name: ability.ability.name,
          effect: ability.ability.url,
        });
      } else {
        const response: IPokemonAbility = await getData(ability.ability.url);
        const englishIndex = response.effect_entries.findIndex(
          (item) => item.language.name === 'en'
        );
        if (englishIndex) {
          allAbilities.push({
            name: response.name,
            effect: response.effect_entries[englishIndex].short_effect,
          });
        } else {
          allAbilities.push({ name: response.name, effect: '/' });
        }
      }
    }
    abilities.value = allAbilities;
    return allAbilities;
  } else {
    return [];
  }
}
</script>

<template>
  <div class="border-2 border-solid border-black mt-4 rounded-md p-2">
    <table class="border-collapse w-full">
      <thead>
        <tr>
          <th class="p-2">Abilities</th>
          <th>Effect</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="ability in abilities">
          <td class="px-4">
            {{ capitalize(ability.name.split('-').join(' ')) }}
          </td>
          <td class="pr-4">
            {{ ability.effect }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
