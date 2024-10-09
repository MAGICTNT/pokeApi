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


async function fetchPokemon(idOrName) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  if (!response.ok) {
    alert('Pokémon non trouvé !');
    return null;
  }
  return await response.json();
}

function displayPokemon(pokemon) {
  console.log(pokemon?.id)
  currentPokemonId = pokemon?.id;

  pokemonName.innerText = pokemon?.name.charAt(0).toUpperCase() + pokemon?.name.slice(1);
  pokemonPicture.src =  statusCheck ?  pokemon?.sprites?.front_shiny : pokemon?.sprites?.front_default;
  pokemonWeight.innerText = `Weight: ${pokemon?.weight}`;
  pokemonHeight.innerText = `Height: ${pokemon?.height}`;
  pokemonId.innerText = `#${pokemon?.id}`;
  console.log(pokemon.sprites.other.showdown.front_default)
  pokemonTypes.innerHTML = '';
  pokemon.abilities.forEach(ability => {
    const li = document.createElement('li');
    li.innerText = ability?.ability.name;
    li.addEventListener('click', () => fetchPokemonByAbility(ability?.ability.name));
    pokemonTypes.appendChild(li);
  });

  pokemonAbilities.innerHTML = '';
  pokemon.types.forEach(type => {
    const li = document.createElement('li');
    li.innerText = type?.type?.name;
    li.addEventListener('click', () => fetchPokemonByType(type?.type?.name));
    pokemonAbilities.appendChild(li);
  });

  pokemonPicture.src = statusCheck ?  pokemon?.sprites?.other.showdown.front_shiny : pokemon?.sprites?.other.showdown.front_default || './assets/img/pokeball.png';
}

// Function pour fetch le precedent Pokemon
async function fetchPreviousPokemon() {
  if (currentPokemonId > 1) {
    const previousPokemon = await fetchPokemon(currentPokemonId - 1);
    if (previousPokemon) displayPokemon(previousPokemon);
    playSound(previousPokemon);
  }
}

// Function pour fetch le prochain Pokemon
async function fetchNextPokemon() {
  const nextPokemon = await fetchPokemon(currentPokemonId + 1);
  if (nextPokemon) displayPokemon(nextPokemon);
  playSound(nextPokemon);
}

// Search event handler
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();


  const input = searchInput.value.trim().toLowerCase();
  const pokemon = await fetchPokemon(input);
  if (pokemon) displayPokemon(pokemon);

  playSound(pokemon);

});

// precedent button event handler
pokemonPrevious.addEventListener('click', fetchPreviousPokemon);

//prochain button event handler
pokemonNext.addEventListener('click', fetchNextPokemon);

// Function to fetch Pokemon par type
async function fetchPokemonByType(type) {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
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

radioShiny.addEventListener('click', async () => {
  const isChecked = radioShiny.checked;
  console.log(`État de la checkbox : ${isChecked ? 'Cochée' : 'Non cochée'}`);
  statusCheck = isChecked;

  const pokemon = await fetchPokemon(currentPokemonId);
  if (pokemon) displayPokemon(pokemon);

  playSound(pokemon);
});


function playSound(pokemon){
  let audio = new Audio(pokemon.cries.latest);
  audio.play();
}
