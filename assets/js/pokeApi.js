import Pokemon from "./pokemon.js";

const searchForm = document.querySelector('#pokemon-search');
const searchInput = document.querySelector('#search-input');
const pokemonName = document.querySelector('#pokemon-name');
const pokemonWeight = document.querySelector('#pokemon-weight');
const pokemonHeight = document.querySelector('#pokemon-height');
const pokemonTypes = document.querySelector('#pokemon-types');
const pokemonAbilities = document.querySelector('#pokemon-abilities');
const pokemonPicture = document.querySelector('#pokemon-picture');
const pokemonPrevious = document.querySelector('#pokemon-previous');
const pokemonNext = document.querySelector('#pokemon-next');
const pokemonId = document.querySelector('#pokemon-id');
const radioShiny = document.querySelector("#shinyCheckbox");
let statusCheck = document.querySelector("#shinyCheckbox").checked;
let currentPokemonId = null;
let pokemon;
async function fetchPokemon(idOrName){
  const response = await fetch(`https://pokeApi.co/api/v2/pokemon/${idOrName}`)
  if(!response.ok){
    alert(`pokemon non trouvé !`);
    return null;
  }
  return await response.json();
}

function displayPokemon(pkData){
  pokemon = new Pokemon(pkData);
  console.log(pokemon.abilities)
  currentPokemonId = pokemon.id
  playSound(pokemon);
  pokemonName.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  pokemonPicture.src =
    statusCheck
      ? pokemon.gif_shiny != null ? pokemon.gif_shiny : pokemon.img_shiny
      : pokemon.gif_default != null ? pokemon.gif_default : pokemon.img_default;
  pokemonWeight.innerText = `Weight: ${pokemon.weight}`;
  pokemonHeight.innerText = `Height: ${pokemon.height}`;
  pokemonTypes.innerHTML = '';
  pokemon.abilities.forEach(ability => {
    const li = document.createElement('li');
    li.innerText = ability;
    li.addEventListener('click', () => fetchPokemonByAbility(ability));
    pokemonTypes.appendChild(li);
  });

  pokemonAbilities.innerHTML = '';

  pokemon.types.forEach(type => {
    const li = document.createElement("li");
    li.innerText = type;
    li.addEventListener('click', () => fetchPokemonByType(type));
  })
}

async function fetchPreviousPokemon() {
  if (currentPokemonId > 1) {
    const previousPokemon = await fetchPokemon(currentPokemonId - 1);
    if (previousPokemon) displayPokemon(previousPokemon);
  }
}

async function fetchNextPokemon() {
  const nextPokemon = await fetchPokemon(currentPokemonId + 1);
  if (nextPokemon) displayPokemon(nextPokemon);
}

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const input = searchInput.value.trim().toLowerCase();
  const pokemon = await fetchPokemon(input);
  if (pokemon) displayPokemon(pokemon);

});

pokemonPrevious.addEventListener('click', fetchPreviousPokemon);

pokemonNext.addEventListener('click', fetchNextPokemon);


radioShiny.addEventListener('click', async () => {
  const isChecked = radioShiny.checked;
  statusCheck = isChecked;

  const pokemon = await fetchPokemon(currentPokemonId);
  if (pokemon) displayPokemon(pokemon);

  playSound(pokemon);
});

async function fetchPokemonByType(type){
  const response = await fetch("https://pokeapi.co/api/v2/type/${type}");
  const data = await response.json();
  const pokemonList = data.pokemon.map(p => p?.pokemon?.name).join(', ');
  alert(`Pokémon avec le type ${type}: ${pokemonList}`);
}

async function fetchPokemonByAbility(ability) {
  const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`);
  const data = await response.json();
  const pokemonList = data.pokemon.map(p => p?.pokemon?.name).join(', ');
  alert(`Pokémon avec l'abilité ${ability}: ${pokemonList}`);
}

function playSound(pokemon){
  console.log("sound : ")
  console.log(pokemon.cries)
  let audio = new Audio(pokemon.cries);
  audio.play().then(r => console.log(r));
}
