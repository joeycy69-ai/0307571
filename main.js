import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  "你是一位可以查詢天氣與時間的小幫手，請用繁體中文回答。請用官方嚴肅的方式回答問題。"
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: getMessages(),
    });

    const content = response.output_text;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}