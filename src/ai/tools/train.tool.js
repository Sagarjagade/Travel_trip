import {tool} from '@langchain/core/tools'
import {z} from 'zod'
import {searchTrains} from '../../services/train.service.js'

export const getTrainsTool = tool(async({from,
    to,
    travelDate,
    travelers})=>{
        return await searchTrains({from,
    to,
    travelDate,
    travelers})
    },{
        name:"get_trains",
        description:
            "Search for available trains between two railway stations for a specific travel date and number of travelers.",

        schema: z.object({

            from: z.string()
                .describe(
                    "Departure railway station code, for example CSMT"
                ),

            to: z.string()
                .describe(
                    "Destination railway station code, for example NDLS"
                ),

            travelDate: z.string()
                .describe(
                    "Travel date in YYYY-MM-DD format"
                ),

            travelers: z.number()
                .int()
                .positive()
                .describe(
                    "Number of travelers"
                )
        })
    })
