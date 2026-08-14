import { client } from "./openai.js";

/**
 * 使用 OpenAI Embeddings API 獲取文本的向量表示
 * @param {string} text - 要轉換為向量的文本
 * @returns {Promise<number[]>} 文本的向量表示
 */
export async function getEmbedding(text) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

/**
 * 計算兩個向量之間的餘弦相似度
 * 相似度範圍：-1 到 1，值越接近 1 表示越相似
 * @param {number[]} vec1 - 第一個向量
 * @param {number[]} vec2 - 第二個向量
 * @returns {number} 餘弦相似度
 */
export function cosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error("向量維度必須相同");
  }

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dotProduct / (mag1 * mag2);
}

/**
 * 計算文本列表中兩兩之間的相似度
 * @param {string[]} texts - 文本列表
 * @returns {Promise<{texts: string[], similarities: number[][]}>} 文本和相似度矩陣
 */
export async function calculateSimilarities(texts) {
  console.log("正在獲取文本向量...");
  const embeddings = await Promise.all(texts.map((text) => getEmbedding(text)));

  console.log("正在計算相似度...");
  const similarities = [];
  for (let i = 0; i < embeddings.length; i++) {
    similarities[i] = [];
    for (let j = 0; j < embeddings.length; j++) {
      similarities[i][j] = cosineSimilarity(embeddings[i], embeddings[j]);
    }
  }

  return { texts, similarities };
}
