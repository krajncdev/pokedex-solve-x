<script setup lang="ts">
import { getData } from '@/config/helpers';
import type { IPokemonAbility } from '@/config/types';
import { usePokemonStore } from '@/stores/pokemon';
import { capitalize } from 'vue';
import { onMounted, ref, watch } from 'vue';

const store = usePokemonStore();
const abilities = ref<IPokemonAbility[]>([]);
const englishEffectIndex = ref<number[]>([]);

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

async function fetchAbilities() {
  const allAbilities: IPokemonAbility[] = [];
  if (store.activePokemon) {
    for (const ability of store.activePokemon.abilities) {
      const response = await getData(ability.ability.url);
      allAbilities.push(response);
    }
    abilities.value = allAbilities;
  }
  englishEffectIndex.value = allAbilities.map((ability) => {
    const englishIndex = ability.effect_entries.findIndex(
      (item) => item.language.name === 'en'
    );
    return englishIndex >= 0 ? englishIndex : -1;
  });
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
        <tr v-for="(ability, i) in abilities">
          <td class="px-4">
            {{ capitalize(ability.name.split('-').join(' ')) }}
          </td>
          <td class="pr-4">
            {{
              ability.effect_entries.length === 0
                ? '/'
                : ability?.effect_entries[englishEffectIndex[i]]?.short_effect
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
