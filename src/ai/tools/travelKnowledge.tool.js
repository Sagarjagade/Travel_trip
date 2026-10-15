import {tool} from '@langchain/core/tools'
import {z} from 'zod'

import {searchTravelKonwlegde} from '../../rag/travelRetriever.js'

export const travelKnowledgeTool = tool(
    async({query,city})=>{
        const result = await searchTravelKonwlegde(query,city)

        if(!result.length){
            return `No travel knowledge found for ${city}.`;
        }

        return result.join("\n\n")
    },{
        name: "travel_knowledge",
        description:
            "Search travel knowledge about tourist places, history, attractions, and sightseeing information for a city.",
        schema: z.object({
            query: z
                .string()
                .describe(
                    "What travel information is needed"
                ),

            city: z
                .string()
                .describe(
                    "The destination city"
                )
        })
    }
)