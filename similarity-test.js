import { calculateSimilarities } from "./lib/embeddings.js";

/**
 * 格式化相似度結果並輸出
 */
function printSimilarityResults(groupName, data) {
  const { texts, similarities } = data;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`${groupName}`);
  console.log(`${"=".repeat(60)}\n`);

  // 打印文本編號
  console.log("文本列表：");
  texts.forEach((text, idx) => {
    console.log(`  ${idx + 1}. ${text}`);
  });

  // 打印相似度矩陣
  console.log("\n相似度矩陣（兩兩比較）：");
  console.log("     ", texts.map((_, i) => `句${i + 1}`.padEnd(8)).join(""));
  console.log("-".repeat(60));

  for (let i = 0; i < texts.length; i++) {
    let row = `句${i + 1} `;
    for (let j = 0; j < texts.length; j++) {
      const similarity = similarities[i][j].toFixed(4);
      row += similarity.padEnd(8);
    }
    console.log(row);
  }

  // 統計平均相似度（不包括自己與自己的比較）
  let totalSimilarity = 0;
  let count = 0;
  for (let i = 0; i < texts.length; i++) {
    for (let j = 0; j < texts.length; j++) {
      if (i !== j) {
        totalSimilarity += similarities[i][j];
        count++;
      }
    }
  }
  const avgSimilarity = totalSimilarity / count;
  console.log(`\n平均相似度（不含自比）: ${avgSimilarity.toFixed(4)}`);
}

/**
 * 主函數：運行相似度實驗
 */
async function main() {
  console.log("🚀 向量相似度實驗開始...\n");

  try {
    // 第 1 組：意思相近的句子
    const group1 = [
      "我喜歡貓",
      "貓咪很可愛",
      "我養了一隻貓",
    ];
    const result1 = await calculateSimilarities(group1);
    printSimilarityResults("第 1 組：意思相近的句子", result1);

    // 第 2 組：意思不同的句子
    const group2 = [
      "今天天氣很好",
      "我要去買菜",
      "電腦壞了",
    ];
    const result2 = await calculateSimilarities(group2);
    printSimilarityResults("第 2 組：意思不同的句子", result2);

    // 第 3 組：自己設計的測試案例（程式設計相關）
    const group3 = [
      "JavaScript 是一種程式語言",
      "JavaScript 可以用來開發網頁應用",
      "我喜歡用 JavaScript 編寫程式",
    ];
    const result3 = await calculateSimilarities(group3);
    printSimilarityResults("第 3 組：自定義測試案例（程式設計相關）", result3);

    // 分析結果
    console.log(`\n${"=".repeat(60)}`);
    console.log("📊 結果分析");
    console.log(`${"=".repeat(60)}\n`);

    const group1Avg = calculateAvgSimilarity(result1.similarities);
    const group2Avg = calculateAvgSimilarity(result2.similarities);
    const group3Avg = calculateAvgSimilarity(result3.similarities);

    console.log(`第 1 組（相近）平均相似度: ${group1Avg.toFixed(4)}`);
    console.log(`第 2 組（不同）平均相似度: ${group2Avg.toFixed(4)}`);
    console.log(`第 3 組（自定義）平均相似度: ${group3Avg.toFixed(4)}`);

    console.log(`\n✅ 分析結論：`);
    if (group1Avg > group2Avg) {
      console.log(`✓ 第 1 組與第 2 組的差異符合預期`);
      console.log(`  相近句子的相似度（${group1Avg.toFixed(4)}）明顯高於`);
      console.log(`  不同句子的相似度（${group2Avg.toFixed(4)}）`);
      console.log(`  差異度: ${(group1Avg - group2Avg).toFixed(4)}`);
    } else {
      console.log(`✗ 第 1 組與第 2 組的差異未符合預期`);
    }

    console.log(`\n🎯 Embeddings API 成功呼叫，向量運算完成！\n`);
  } catch (error) {
    console.error("❌ 錯誤發生：", error.message);
    process.exit(1);
  }
}

/**
 * 計算相似度矩陣的平均值（不包括自己與自己的比較）
 */
function calculateAvgSimilarity(similarities) {
  let total = 0;
  let count = 0;
  for (let i = 0; i < similarities.length; i++) {
    for (let j = 0; j < similarities.length; j++) {
      if (i !== j) {
        total += similarities[i][j];
        count++;
      }
    }
  }
  return total / count;
}

// 運行測試
main();
