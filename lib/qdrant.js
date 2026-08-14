import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { client } from "./openai.js";

export const qdrant = new QdrantClient({
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }),
  checkCompatibility: false,
});

export const COFFEE_COLLECTION = "coffee";
export const EMBEDDING_DIM = 1536;
export const EMBEDDING_MODEL = "text-embedding-3-small";

export async function embed(text) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return res.data[0].embedding;
}

export async function searchCoffee(query, limit = 5) {
  const vector = await embed(query);

  const results = await qdrant.search(COFFEE_COLLECTION, {
    vector,
    limit,
    with_payload: true,
  });

  return results.map((r) => ({
    score: r.score,
    Coffee_Drink: r.payload.Coffee_Drink,
    Main_Ingredients: r.payload.Main_Ingredients,
    Flavor_Profile: r.payload.Flavor_Profile,
    Best_For: r.payload.Best_For,
    Description: r.payload.Description
  }));
}
