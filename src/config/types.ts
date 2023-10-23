export interface IPokemon {
  id: number;
  height: number;
  weight: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  name: string;
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
    };
    versions: {
      [unknown: string]: {
        [unknown: string]: {
          front_default: string;
        };
      };
    };
  };
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
}

export interface IPokemonAllResults {
  name: string;
  url: string;
}

export interface IPokemonAll {
  count: number;
  results: IPokemonAllResults[];
}

export interface IPokemonAbility {
  pokemon: {
    is_hidden: boolean;
    slot: number;
    pokemon: IPokemonAllResults;
  }[];
  name: string;
  is_main_series: boolean;
  id: number;
  generation: {
    name: string;
    url: string;
  };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
}

export interface IUploadImageResponse {
  id: string;
  height: number;
  width: number;
  delete_url: string;
  display_url: string;
  size: number;
  time: number;
  title: string;
  url: string;
}

export interface ICustomPokemon {
  name: string;
  description: string;
  response: {
    data: IUploadImageResponse;
  };
}
