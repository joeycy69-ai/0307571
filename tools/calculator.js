export const calculateTool = {
  type: "function",
  //定義name
  name: "calculate",
  description: "進行數學計算",
  parameters: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: '數學運算式，例如 "8 + 3 * 2"、"(6 + 3) / 5"、"4 ** 3"',
      },
    },
    required: ["expression"],
    additionalProperties: false,
  },
  strict: true,
};

export async function calculate({ expression }) {
  try {
    if (typeof expression !== "string") {
      return { error: "expression 必須是字串" };
    }

    const trimmedExpression = expression.trim();

    if (trimmedExpression.length === 0) {
      return { error: "expression 不可為空" };
    }

    // 只允許數字、空白、小數點、括號與基本數學運算符號
    // 避免執行到 JavaScript 其他程式碼
    const allowedPattern = /^[0-9+\-*/().\s%]+$/;

    if (!allowedPattern.test(trimmedExpression)) {
      return {
        error: "運算式包含不允許的字元，只能使用數字、+、-、*、/、%、括號與小數點",
      };
    }

    // 使用 Function 取代直接 eval，並搭配白名單檢查
    const result = Function(`"use strict"; return (${trimmedExpression});`)();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      return { error: "計算結果不是有效數字" };
    }

    return {
      expression: trimmedExpression,
      result,
    };
  } catch (error) {
    return {
      error: `計算失敗：${error.message}`,
    };
  }
}
