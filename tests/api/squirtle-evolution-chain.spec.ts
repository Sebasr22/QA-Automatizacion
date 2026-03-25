import { test, expect, APIRequestContext } from "@playwright/test";

interface PokemonEvolutionEntry {
  name: string;
  weight: number;
}

interface EvolutionChainLink {
  species: { name: string; url: string };
  evolves_to: EvolutionChainLink[];
}

async function getJson(request: APIRequestContext, url: string) {
  const response = await request.get(url);
  expect(response.status(), `GET ${url}`).toBe(200);
  return response.json();
}

function extractSpeciesNames(chain: EvolutionChainLink): string[] {
  const names: string[] = [chain.species.name];
  for (const next of chain.evolves_to) {
    names.push(...extractSpeciesNames(next));
  }
  return names;
}

// Bubble sort — sin usar .sort() ni .toSorted()
function sortAlphabetically(items: PokemonEvolutionEntry[]): PokemonEvolutionEntry[] {
  const sorted = [...items];
  for (let i = 0; i < sorted.length - 1; i++) {
    for (let j = 0; j < sorted.length - 1 - i; j++) {
      if (sorted[j].name > sorted[j + 1].name) {
        const temp = sorted[j];
        sorted[j] = sorted[j + 1];
        sorted[j + 1] = temp;
      }
    }
  }
  return sorted;
}

test("obtener cadena de evoluciones de Squirtle con nombres y peso ordenados alfabeticamente", async ({
  request,
}) => {
  // Obtener datos del pokemon Squirtle
  const pokemonData = await getJson(request, "pokemon/squirtle");
  const speciesUrl: string = pokemonData.species.url;

  // Obtener datos de la especie para llegar a la cadena de evolucion
  const speciesData = await getJson(request, speciesUrl);
  const evolutionChainUrl: string = speciesData.evolution_chain.url;

  // Obtener la cadena de evolucion completa
  const evolutionChainData = await getJson(request, evolutionChainUrl);
  const chain: EvolutionChainLink = evolutionChainData.chain;

  // Extraer nombres de todas las especies en la cadena
  const speciesNames = extractSpeciesNames(chain);
  expect(speciesNames.length).toBeGreaterThan(0);

  // Obtener el peso de cada especie
  const entries: PokemonEvolutionEntry[] = [];
  for (const name of speciesNames) {
    const data = await getJson(request, `pokemon/${name}`);
    entries.push({ name, weight: data.weight });
  }

  // Ordenar alfabeticamente sin metodos nativos
  const sorted = sortAlphabetically(entries);

  // Validar que el orden es correcto
  for (let i = 0; i < sorted.length - 1; i++) {
    expect(sorted[i].name < sorted[i + 1].name).toBe(true);
  }

  // Imprimir resultado
  console.log("\nCadena de evolucion de Squirtle (orden alfabetico):");
  for (const entry of sorted) {
    console.log(`  ${entry.name} - peso: ${entry.weight}`);
  }
});
