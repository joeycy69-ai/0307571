import { input } from "@inquirer/prompts";
import { searchNetflix } from "./lib/qdrant.js";
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
    const results = await searchNetflix(query, 5);
    spin.stop();

    for (const [i, r] of results.entries()) {
      console.log(`\n${i + 1}. ${r.Coffee_Drink} (${r.type}, ${r.Main_Ingredients})`);
      console.log(`   口味：${r.Flavor_Profile}`);
      //console.log(`   分類：${r.listed_in}`);
      console.log(`   描述：${r.Description}`);
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
