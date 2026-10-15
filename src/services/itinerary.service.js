import {setCache,getCache} from '../cache/cacheService.js'
import {ChatOpenAI} from '@langchain/openai'
import {PromptTemplate} from '@langchain/core/prompts'
import OpenAILLM from '../ai/llm.js'
const llm = OpenAILLM

const prompt = PromptTemplate.fromTemplate(`
            You are an expert AI travel planner.

                Create a practical travel itinerary using the information below.

                USER TRIP
                From: {from}
                Destination: {destination}
                Days: {days}
                Budget: ₹{budget}
                Travelers: {travelers}

                FLIGHTS:
                {flights}

                TRAINS:
                {trains}

                HOTELS:
                {hotels}

                ROUTES:
                {routes}

                PLACES:
                {places}

                IMPORTANT RULES:

                1. Create exactly {days} days.
                2. Consider the user's budget.
                3. Use the provided flights/trains/hotels when relevant.
                4. Don't invent prices, hotels, trains or flights.
                5. Group nearby places together to reduce travel time.
                6. Include estimated travel time when route information is available.
                7. Keep the itinerary practical.
                8. Include morning, afternoon and evening activities.
                9. Return ONLY valid JSON.
                10. Do not use markdown.

                Return this structure:

                {{
                    "from": "{from}",
                    "destination": "{destination}",
                    "days": {days},
                    "budget": {budget},
                    "travelers": {travelers},

                    "transport": {{
                        "flight": null,
                        "train": null
                    }},

                    "hotel": null,

                    "dayPlans": [
                        {{
                            "day": 1,
                            "title": "",
                            "activities": [
                                {{
                                    "time": "",
                                    "place": "",
                                    "description": "",
                                    "travelTime": ""
                                }}
                            ]
                        }}
                    ],

                    "estimatedBudget": {{
                        "transport": 0,
                        "hotel": 0,
                        "food": 0,
                        "activities": 0,
                        "localTransport": 0,
                        "total": 0
                    }}
                }}
`)


export async function generateItinerary({from,destination,days,budget,travelers,flights,hotels,trains,routes,places}) {
    const CacheKey = `itinerary:${from}:${destination}:${days}:${budget}:${travelers}`
    const cached = await getCache(CacheKey)
    if(cached){
        return cached
    }

    const chains = prompt.pipe(llm)
    const response = await chains.invoke({
        from,
        destination,
        days,
        budget,
        travelers,

        flights: JSON.stringify(flights, null, 2),
        hotels: JSON.stringify(hotels, null, 2),
        trains: JSON.stringify(trains, null, 2),
        routes: JSON.stringify(routes, null, 2),
        places: JSON.stringify(places, null, 2)
    });

    let itinerary;

    try{
        itinerary = JSON.parse(response.content)
    }catch(err){
        console.error(
            "Invalid LLM JSON",response.content
        )
    }

    await setCache(CacheKey,itinerary,86400)

    return itinerary
    
}

