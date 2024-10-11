import Pokemon from "./pokemon.js";

const optionType = document.querySelector("#option"); // Changez l'ID si nécessaire
const listPokemon = document.querySelector("#listPokemon");
const radioShiny = document.querySelector("#shinyCheckbox");
const countPoke = document.querySelector("#countPoke");
let countFinal = 0;
let statusCheck = radioShiny.checked;
let typeSelect = "";

// Fonction pour récupérer tous les types de Pokémon
async function fetchAllTypes() {
  const response = await fetch(`https://pokeapi.co/api/v2/type/?limit=100`);
  if (!response.ok) {
    alert(`Types non trouvés !`);
    return null;
  }
  return await response.json();
}

// Fonction pour afficher tous les types dans le select
function displayAllTypes(data) {
  let sortedData = data.results.sort((a, b) => a.name.localeCompare(b.name));

  sortedData.forEach((tab) => {
    let option = document.createElement("option");
    option.value = tab.name;
    option.innerText = tab.name.charAt(0).toUpperCase() + tab.name.slice(1); // Mettre en majuscule la première lettre
    optionType.appendChild(option);
  });
}

// Fonction pour générer les types
async function generatorAllTypes() {
  const types = await fetchAllTypes();
  if (types) displayAllTypes(types);
}

// Appel pour générer les types au chargement
generatorAllTypes();

// Fonction pour récupérer les Pokémon par type
async function fetchPokemonByType(type) {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
  if (!response.ok) {
    alert(`Aucun Pokémon trouvé pour ce type !`);
    return null;
  }
  return await response.json();
}

// Fonction pour afficher un Pokémon
function displayPokemon(pkData) {
  let pokemon = new Pokemon(pkData);
  countFinal++;
  countPoke.innerText = countFinal;

  let div = document.createElement("div");
  div.id = "contentPokemon";
  let img = document.createElement("img");
  img.id = "imgPokemon";

  if (!statusCheck) {
    img.src = pokemon.gif_default || pokemon.img_default;
  } else {
    img.src = pokemon.gif_shiny || pokemon.gif_default || pokemon.img_shiny || pokemon.img_default;
  }

  img.onload = function () {
    if (img.width > 200) {
      div.style.width = `${img.width}px`;
    }
  };

  div.appendChild(img);
  let paragraph = document.createElement("p");
  paragraph.id = "namePokemon";
  paragraph.innerHTML = "#" + pokemon.id + "</br>" + pokemon.name;
  div.appendChild(paragraph);
  listPokemon.appendChild(div);
}

async function fetchByUrl(apiUrl) {
  const response = await fetch(apiUrl)
  if (!response.ok) {
    alert(`fetch url non trouvé !`);
    return null;
  }
  return await response.json();
}

async function displayPokemons(pkData) {
  listPokemon.innerHTML = "";

  if (pkData.pokemon.length === 0) {
    alert("Aucun Pokémon trouvé pour ce type !");
    return;
  }
  countFinal=0;
  countPoke.innerText = countFinal;
  for (let pokemon of pkData.pokemon) {
    let poke = await fetchByUrl(pokemon.pokemon.url);
    if (poke) displayPokemon(poke);
  }
}

optionType.addEventListener("change", async (event) => {
  typeSelect = event.target.value;
  const choix = await fetchPokemonByType(typeSelect);
  if (choix) displayPokemons(choix);
});

radioShiny.addEventListener('click', async () => {
  const isChecked = radioShiny.checked;
  statusCheck = isChecked;

  const choix = await fetchPokemonByType(typeSelect);
  if (choix) displayPokemons(choix);
});

