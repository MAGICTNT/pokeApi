export default class Pokemon {
  constructor(pokemon) {
    this.id = pokemon.id
    this.name = pokemon.name;
    this.img_shiny = pokemon?.sprites?.front_shiny;
    this.gif_shiny = pokemon.sprites.other.showdown.front_shiny;
    this.img_default = pokemon?.sprites?.front_default;
    this.gif_default = pokemon.sprites.other.showdown.front_default;
    this.weight = pokemon.weight;
    this.height = pokemon.height;
    this.cries = pokemon.cries.latest;
    this.types = pokemon.types.map(type => type.type.name);
    this.abilities = pokemon.abilities.map(ability => ability.ability.name);
  }
}

