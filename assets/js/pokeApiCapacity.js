import Pokemon from "./pokemon.js";

const optionCapacity = document.querySelector("#option");
const listPokemon = document.querySelector("#listPokemon");
const radioShiny = document.querySelector("#shinyCheckbox");
let statusCheck = document.querySelector("#shinyCheckbox").checked;
let capacitySelect = "";

async function fetchAllCapacity() {
  const response = await fetch(`https://pokeapi.co/api/v2/ability/?limit=1000`)
  if (!response.ok) {
    alert(`capacity non trouvé !`);
    return null;
  }
  return await response.json();
}

function displayAllCapacity(data) {
  let sortedData = data.results.sort((a, b) => a.name.localeCompare(b.name));

  sortedData.forEach((tab) => {
    let option = document.createElement("option");
    option.value = tab.name;
    option.innerText = tab.name;
    optionCapacity.appendChild(option);
  });
}

async function generatorAll() {
  const capacity = await fetchAllCapacity();
  if (capacity) displayAllCapacity(capacity);
}

generatorAll();

async function fetchCapacityByName(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/ability/${name}`)
  if (!response.ok) {
    alert(`capacity name non trouvé !`);
    return null;
  }
  return await response.json();
}

async function fetchByUrl(apiUrl) {
  const response = await fetch(apiUrl)
  if (!response.ok) {
    alert(`fetch url non trouvé !`);
    return null;
  }
  return await response.json();
}

// async function generatorPokemons() {
//   const capacity = await fetchCapacityByName();
//   if (capacity) displayAllCapacity(capacity);
// }

function displayPokemon(pkData) {
  let pokemon = new Pokemon(pkData);
  console.log(pokemon)
  let div = document.createElement("div");
  div.id = "contentPokemon";
  let img = document.createElement("img");
  img.id = "imgPokemon";
  if (!statusCheck) {
    img.src = pokemon.gif_default != null
      ? pokemon.gif_default
      : pokemon.img_default;
  } else {
    img.src = pokemon.gif_shiny != null ? pokemon.gif_shiny
      : pokemon.gif_default != null ? pokemon.gif_default
        : pokemon.img_shiny != null ? pokemon.img_shiny
          : pokemon.img_default;
  }

  img.onload = function () {
    if (img.width > 200) {
      div.style.width = `${img.width}px`;
    }
    console.log(`taille ${img.width}x${img.height}`)

  };
  div.appendChild(img);
  let paragraph = document.createElement("p");
  paragraph.id = "namePokemon";
  paragraph.innerHTML = "#" + pokemon.id + "</br>" + pokemon.name;
  div.appendChild(paragraph);
  listPokemon.appendChild(div);

}

async function displayPokemons(pkData) {
  listPokemon.innerHTML = "";

  // Vérifie si la liste de Pokémon est vide
  if (pkData.pokemon.length === 0) {
    alert("Aucun Pokémon trouvé pour cette capacité !");
    return;
  }

  for (let pokemon of pkData.pokemon) {
    let poke = await fetchByUrl(pokemon.pokemon.url);
    if (poke) displayPokemon(poke);
  }
}

optionCapacity.addEventListener("change", async (event) => {
  capacitySelect = event.target.value;
  const choix = await fetchCapacityByName(capacitySelect);
  if (choix) displayPokemons(choix);
});

radioShiny.addEventListener('click', async () => {
  const isChecked = radioShiny.checked;
  statusCheck = isChecked;

  const choix = await fetchCapacityByName(capacitySelect);
  if (choix) displayPokemons(choix);

});






