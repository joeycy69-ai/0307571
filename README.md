作業四的執行對話：

@joeycy69-ai ➜ /workspaces/ai-agent-js-v2 (04) $ node function_call.js

[呼叫 tool] get_current_time({})
現在台灣時間是 2026/8/14 下午 4:26:53。
@joeycy69-ai ➜ /workspaces/ai-agent-js-v2 (04) $ node function_call.js

[呼叫 tool] get_weather({"city":"Taipei"})
台北目前天氣是 **大雨**，氣溫約 **29.8°C**，濕度 **87%**。  
如果你要，我也可以順便幫你看今天適不適合出門、要不要帶傘。
@joeycy69-ai ➜ /workspaces/ai-agent-js-v2 (04) $ node function_call.js

[呼叫 tool] get_current_time({})

[呼叫 tool] get_weather({"city":"Taipei"})
現在台灣時間是 **2026/8/14 下午4:28:00**。

台北天氣 **不太好**，目前是 **大雨**，氣溫約 **29.8°C**，濕度 **87%**。  
如果你要出門，建議帶傘。
@joeycy69-ai ➜ /workspaces/ai-agent-js-v2 (04) $ 