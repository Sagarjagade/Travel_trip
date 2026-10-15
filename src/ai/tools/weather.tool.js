import {z} from 'zod'
import {tool} from '@langchain/core/tools'

import {getWeather} from '../../services/weather.service.js';

export const weatherTool = tool(
    async({latitude, longitude})=>{
    return await getWeather(latitude,longitude)
},{
    name:"get_weather",
    description:"Get current and forecast weather for a location",
    schema:z.object({
        latitude:z.number(),
        longitude:z.number()
    })
})