import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { getAllPokemon, getData } from '@/config/helpers';
import type {
  ICustomPokemonEntry,
  IPokemon,
  IPokemonAll,
  IPokemonAllResults,
} from '@/config/types';

export const usePokemonStore = defineStore('pokemon', () => {
  const allPokemon: Ref<IPokemonAll | null> = ref(null);
  const showedPokemon: Ref<IPokemonAllResults[] | undefined> = ref([]);
  const activePokemon: Ref<IPokemon | null> = ref(null);
  const customPokemon: Ref<IPokemon[] | null> = ref([]);
  const isSelectOpen = ref(false);

  const addCustomPokemon = (pokemon: IPokemon) => {
    customPokemon.value?.push(pokemon);
  };

  const addAllPokemon = async () => {
    try {
      allPokemon.value = await getAllPokemon();
    } catch (err) {
      console.error('Error', err);
    }
  };

  const resetShowedPokemon = () => {
    showedPokemon.value = [];
  };

  const changeShowedPokemon = (input: string) => {
    const filtered = allPokemon.value?.results.filter((pokemon) =>
      pokemon?.name.toLowerCase().startsWith(input.toLowerCase())
    );
    showedPokemon.value = filtered;
  };

  const changeActivePokemon = async (url: string) => {
    try {
      const response: IPokemon = await getData(url);
      const foundPokemonMatch = customPokemon.value?.find(
        (pokemon) => pokemon.id === response.id
      );
      console.log(customPokemon.value);
      if (foundPokemonMatch) {
        activePokemon.value = foundPokemonMatch;
      } else {
        activePokemon.value = response;
      }
    } catch (err) {
      console.error('Error: not a valid link');
      return -1;
    }
  };

  const editActivePokemon = (customPokemonEntry: ICustomPokemonEntry) => {
    // tu se updata search
    allPokemon.value?.results.map((pokemon, i) => {
      if (pokemon.name === activePokemon.value?.name) {
        if (allPokemon.value) {
          allPokemon.value.results[i].name = customPokemonEntry.name;
        }
      }
    });

    if (activePokemon.value) {
      activePokemon.value = {
        ...activePokemon.value,
        name: customPokemonEntry.name,
      }; // to triggera spremembo v activePokemonu in omogoči lažje spremljanje tega state-a
      activePokemon.value.sprites.other['official-artwork'].front_default =
        customPokemonEntry.url;
      const customAbilityEntry = {
        ability: {
          name: 'Custom',
          url: customPokemonEntry.description,
        },
      };
      const customIndex = activePokemon.value.abilities.findIndex(
        (ability) => ability.ability.name === 'Custom'
      );
      if (customIndex === -1) {
        activePokemon.value.abilities.push(customAbilityEntry);
      } else {
        activePokemon.value.abilities[customIndex].ability.url =
          customPokemonEntry.description;
      }
      if (customPokemon.value) {
        const indexOfPokemon = customPokemon.value.findIndex((item) => {
          if (activePokemon.value) {
            return item.id === activePokemon.value.id;
          }
        });
        if (indexOfPokemon === -1) {
          addCustomPokemon(activePokemon.value);
        } else {
          customPokemon.value[indexOfPokemon] = activePokemon.value;
        }
      }
    }
  };

  const openIsSelectOpen = () => {
    isSelectOpen.value = true;
  };

  const closeIsSelectOpen = () => {
    isSelectOpen.value = false;
  };

  return {
    allPokemon,
    showedPokemon,
    activePokemon,
    isSelectOpen,
    customPokemon,
    addCustomPokemon,
    addAllPokemon,
    changeShowedPokemon,
    changeActivePokemon,
    resetShowedPokemon,
    openIsSelectOpen,
    closeIsSelectOpen,
    editActivePokemon,
  };
});
