import { tool } from "@langchain/core/tools";
import { z } from "zod";

import {
    getRoute
} from "../../services/route.service.js";

export const routesTool = tool(
    async ({ startLongitude,startLatitude,endLongitude,endLatitude,mode }) => {

        return await getRoute(
            startLongitude,startLatitude,endLongitude,endLatitude,mode
        );

    },
    {
        name: "get_route",

        description:
            "Calculate a route between a starting location and destination. Use this tool to get distance, travel duration, and route information for driving, walking, cycling, or other supported travel modes.",

        schema: z.object({

            startLongitude: z.number()
                .describe("Starting location longitude"),

            startLatitude: z.number()
                .describe("Starting location latitude"),

            endLongitude: z.number()
                .describe("Destination longitude"),

            endLatitude: z.number()
                .describe("Destination latitude"),

            mode: z.string()
                .describe(
                    "Travel mode such as driving-car, cycling-regular, or foot-walking"
                )
        })
    }
);