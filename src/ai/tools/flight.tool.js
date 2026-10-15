import {tool} from '@langchain/core/tools'
import {z} from 'zod'
import {searchFlights} from '../../services/flight.service.js'

export const fligthTool = tool(async({from,to,departureDate,travelers})=>{
    return await searchFlights({from,to,departureDate,travelers})
},{
    name:"get_flight",
    description:"",
    schema:z.object({
        from:z.string(),
        to:z.string(),
        departureDate:z.string(),
        travelers:z.string()
    })
})