import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

async function getYoubikeStations({ area }) {
  const url = new URL("https://data.ntpc.gov.tw/api/datasets/71CD1490-A2DF-4196-986C-47D1D2342F21/json");
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { error: `YouBike API error: ${res.status}` };
    }

    const data = await res.json();
    
    // Filter stations by area if provided
    const stations = data.filter(station => 
      !area || station.area === area
    ).slice(0, 5); // Return top 5 stations
    
    return {
      area: area || "全部",
      stations: stations.map(station => ({
        name: station.name,
        available: station.available_bikes || 0,
        total: station.total || 0,
        address: station.address,
      })),
    };
  } catch (error) {
    return { error: `Error fetching YouBike data: ${error.message}` };
  }
}

export const youbikeTool = defineTool({
  name: "get_youbike_stations",
  description: "查詢YouBike站點信息，包括可用自行車數量、站點總數等。",
  fn: getYoubikeStations,
  parameters: z.object({
    area: z.string().nullable().optional().describe("地區名稱（例如：新北市、台北市），不提供則返回全部"),
  }),
});
