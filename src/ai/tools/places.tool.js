import { tool } from "@langchain/core/tools";
import { z } from "zod";

import {
    getHistoricalPlaces
} from "../../services/places.service.js";

export const placesTool = tool(
    async ({ latitude, longitude }) => {

        return await getHistoricalPlaces(
            latitude,
            longitude
        );

    },
    {
        name: "search_historical_places",

        description:
            "Find historical and tourist places near a location",

        schema: z.object({
            latitude: z.number(),
            longitude: z.number()
        })
    }
);