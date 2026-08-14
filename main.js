import { input } from "@inquirer/prompts";
import { searchCoffee } from "./lib/qdrant.js";
import { spinner } from "./utils/spinner.js";

try {
  while (true) {
    const query = (
      await input({ message: "請輸入要搜尋的咖啡內容：" })
    ).trim();

    if (query === "") continue;
    if (query.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    const spin = spinner("搜尋中...").start();
    const results = await searchCoffee(query, 5);
    spin.stop();

    for (const [i, r] of results.entries()) {
      console.log(`\n${i + 1}. ${r.Coffee_Drink}`);
      console.log(` 相似度分數：${r.score}`);
      console.log(` 主要材料：${r.Main_Ingredients}`);
      console.log(` 口味：${r.Flavor_Profile}`);
      console.log(` 適合：${r.Best_For}`);
      console.log(` 描述：${r.Description}`);
    }
    console.log();
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
