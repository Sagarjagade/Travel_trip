import {tool} from'@langchain/core/tools'
import {z} from 'zod'
import { getLocation } from '../../services/location.service.js'

export const locationTool = tool(async({city})=>{
    return await getLocation({city})
},{
    name:"get_location",
    description:"Convert a city name into latitude and longitude",
    schema:z.object({
        city:z.string()
    })
})