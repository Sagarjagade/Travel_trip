import { tool } from "@langchain/core/tools";
import {z} from 'zod'
import { searchHotels } from '../../services/hotel.service.js'

export const hotelTool = tool(async({latitude,
    longitude,
    checkIn,
    checkOut,
    guests})=>{
    return await searchHotels({latitude,
    longitude,
    checkIn,
    checkOut,
    guests})
},{
    name:"get_hotel",
    description:"Find available hotels near a specific location for the given check-in and check-out dates and number of guests.",
    schema: z.object({

        latitude: z.number()
            .describe("Latitude of destination"),

        longitude: z.number()
            .describe("Longitude of destination"),

        checkIn: z.string()
            .describe("Check-in date in YYYY-MM-DD format"),

        checkOut: z.string()
            .describe("Check-out date in YYYY-MM-DD format"),

        guests: z.number()
            .int()
            .positive()
            .describe("Number of guests")
    })
})