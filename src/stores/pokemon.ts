import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { getAllPokemon, getData } from '@/config/helpers';
import type {
  ICustomPokemon,
  IPokemon,
  IPokemonAll,
  IPokemonAllResults,
} from '@/config/types';

export const usePokemonStore = defineStore('pokemon', () => {
  const allPokemon: Ref<IPokemonAll | null> = ref(null);
  const showedPokemon: Ref<IPokemonAllResults[] | undefined> = ref([]);
  const activePokemon: Ref<IPokemon | null> = ref(null);
  const customPokemon: Ref<ICustomPokemon[] | null> = ref([]);
  const isSelectOpen = ref(false);

  const addCustomPokemon = (pokemon: ICustomPokemon) => {
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
      pokemon?.name.startsWith(input)
    );
    showedPokemon.value = filtered;
  };

  const changeActivePokemon = async (url: string) => {
    try {
      activePokemon.value = await getData(url);
    } catch (err) {
      console.error('Error: not a valid link');
      return -1;
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
  };
});
