import  {setCache,getCache} from '../cache/cacheService.js'
import axios from 'axios'
import trains from "../utils/trains.json" with { type: "json" };
import {trainsSchema} from '../schema/trains.schema.js'
import OpenAILLM from '../ai/llm.js'

const model = OpenAILLM;
const structuredModel =
    model.withStructuredOutput(
        trainsSchema
    );

export function searchStations(city) {

    const search = city.trim().toLowerCase();

    const stations = trains.filter(station =>
        station.city?.toLowerCase() === search ||
        station.name?.toLowerCase().includes(search) ||
        station.code?.toLowerCase() === search
    );

    return stations;
}

export async function searchTrains({
    from,
    to,
    travelDate,
    travelers=1
}) {
    console.log("trains")

    
    const CacheKey = `Trains:${from}.${to}.${travelDate}.${travelers}`
    const cached = await getCache(CacheKey)
    if(cached){
        return cached
    }

    const fromCode =  searchStations(from);
    const toCode =  searchStations(to);
    const from_id = fromCode[0].code;
    const to_code_id=toCode[0].code;

    const response = await axios.get(
            `https://api.railradar.in/v1/trains/between/${from_id}/${to_code_id}`,
            {
                params: {
                    date: travelDate,
                    byCity: true
                },
                headers: {
                    Authorization: `Bearer ${process.env.TRAIN_API_KEY}`
                }
            }
        );

        const trains = response.data.data.trains;

        const formattedTrains = trains.map(item => ({
            trainNumber: item.train?.number ?? null,
            trainName: item.train?.name ?? null,
            fromStation: response.data.data.from?.name ?? null,
            departureTime: item.from?.departure ?? null,
            toStation: response.data.data.to?.name ?? null,
            arrivalTime: item.to?.arrival ?? null
        }));
// console.log("formattedTrains>>",formattedTrains)
    // await setCache(CacheKey,trains,3600)

    return formattedTrains
}

export async function searchTrains_bkp({
    from,
    to,
    travelDate,
    travelers=1
}) {
    console.log("trains")

    
    const CacheKey = `Trains:${from}.${to}.${travelDate}.${travelers}`
    const cached = await getCache(CacheKey)
    if(cached){
        return cached
    }
    
    const prompt = `${from} to ${to} travel date ${travelDate} return Trains number,train name,
                        fromStation,departureTime,toStation,arrivalTime 
                        in json format`;

     const result = await structuredModel.invoke(prompt)
console.log("trains_serive>>",result)
    return result
}


