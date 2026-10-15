import { ChatOpenAI } from "@langchain/openai";
import {createAgent} from 'langchain'
import {fligthTool} from './tools/flight.tool.js'
import {getTrainsTool} from './tools/train.tool.js'
import {locationTool} from './tools/location.tool.js'
import {placesTool} from './tools/places.tool.js'
import {routesTool} from './tools/route.tool.js'
import {hotelTool} from './tools/hotel.tool.js'
import {weatherTool} from './tools/weather.tool.js'
import {travelKnowledgeTool} from './tools/travelKnowledge.tool.js'
import {travelPlanSchema} from '../schema/travel-plan.schema.js'
import OpenAILLM from './llm.js'
import fs from "fs";

const model = OpenAILLM;

const structuredModel =
    model.withStructuredOutput(
        travelPlanSchema
    );

const tools = [
    fligthTool,
    getTrainsTool,
    locationTool,
    placesTool,
    routesTool,
    hotelTool,
    weatherTool,
    travelKnowledgeTool
]

// const agent = createAgent({
//     model,tools,
//     systemPrompt:`You are an AI Travel Planner.
//             Use tools to collect real travel information.

//             Rules:
//             - Use live API tools for flights, trains, hotels, weather, places and routes.
//             - Never invent API results.
//             - Use travel knowledge only for descriptions, history and general travel information.
//             - Respect the user's budget, transport and hotel preference.
//             - Group nearby attractions.
//             - Consider weather and travel time.
//             - Avoid too many attractions in one day.
//             `
// })

function compactPlace(place) {
    return {
        name: place.name,
        category: place.category,
        lat: place.latitude,
        lng: place.longitude,
        rating: place.rating,
        distance: place.distance,
        duration: place.duration,
        image: place.image,
        address: place.address,
        googleMapsUrl: place.googleMapsUrl,
        osmUrl: place.osmUrl
    };
}

function compactHotel(hotel) {
    return {
        name: hotel.name,
        rating: hotel.rating,
        price: hotel.price,
        address: hotel.address,
        lat: hotel.latitude,
        lng: hotel.longitude,
        image: hotel.image,
        googleMapsUrl: hotel.googleMapsUrl
    };
}

function compactWeather(weather) {
    return {
        date: weather.date,
        temperature: weather.temperature,
        condition: weather.condition,
        precipitation: weather.precipitation,
        rain: weather.rain
    };
}


export async function generateTravelPlan(tripContext,res) {
    
   const itineraryData = {
            trip: {
                from: tripContext.trip.from,
                to: tripContext.trip.to,
                days: tripContext.trip.days,
                budget: tripContext.trip.budget,
                startDate: tripContext.trip.startDate
            },

            transport: tripContext.transport,

            hotelPreference: tripContext.hotel,

            source: {
                name: tripContext.location?.[0]?.from?.value?.name,
                lat: tripContext.location?.[0]?.from?.value?.latitude,
                lng: tripContext.location?.[0]?.from?.value?.longitude
            },

            destination: {
                name: tripContext.location?.[0]?.to?.value?.name,
                lat: tripContext.location?.[0]?.to?.value?.latitude,
                lng: tripContext.location?.[0]?.to?.value?.longitude
            },

            route: {
                distance: tripContext.route?.distance,
                duration: tripContext.route?.duration
            },

            weather: Array.isArray(tripContext.weather)
                ? tripContext.weather.map(compactWeather)
                : [],

            hotels: Array.isArray(tripContext.hotels)
                ? tripContext.hotels.map(compactHotel)
                : [],

            places: Array.isArray(tripContext.places)
                ? tripContext.places.map(compactPlace)
                : [],

            budget: tripContext.budget
        };

        const prompt = `
        Create a ${itineraryData.trip.days}-day itinerary.

        INPUT:
        ${JSON.stringify(itineraryData)}

        RULES:
        1. Exactly ${itineraryData.trip.days} days.
        2. Use only INPUT data.
        3. Do not invent coordinates, prices, distances, routes, images or URLs.
        4. Consider weather, distance, transport and budget.
        5. Group nearby places.
        6. Avoid too many activities/day.
        7. Missing data = "" or 0 for cost.
        8. Return only structured output.
        `;


        const result = await structuredModel.invoke(prompt)

        return result
}