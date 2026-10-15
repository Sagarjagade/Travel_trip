import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import OpenAILLM from '../ai/llm.js'


const llm = OpenAILLM


export async function generateTripItinerary(context) {

    console.log("Generating AI trip itinerary...");

    const systemPrompt = `
You are an AI travel planner.

Your job is to create a practical day-wise travel itinerary
using ONLY the travel information provided by the application.

IMPORTANT RULES:

1. Do not invent hotels, flights, trains, prices or weather.
2. Use the provided places whenever possible.
3. Respect the user's budget.
4. Respect the number of trip days.
5. Consider the user's interests.
6. Group nearby places together when possible.
7. Do not schedule too many places in one day.
8. Consider travel time when creating the itinerary.
9. If some data is unavailable, clearly mention it.
10. Return ONLY valid JSON.
`;


    const humanPrompt = `
Create a travel itinerary from the following trip context.

TRIP CONTEXT:

${JSON.stringify(context, null, 2)}

Return JSON using exactly this structure:

{
    "summary": "",
    "transport": {
        "type": "",
        "details": "",
        "estimatedCost": 0
    },
    "hotel": {
        "name": "",
        "details": "",
        "estimatedCost": 0
    },
    "itinerary": [
        {
            "day": 1,
            "date": "",
            "title": "",
            "places": [],
            "activities": [],
            "travelNotes": [],
            "estimatedExpense": 0
        }
    ],
    "budget": {
        "totalEstimated": 0,
        "remaining": 0
    },
    "tips": []
}
`;


    const response = await llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(humanPrompt)
    ]);


    const content = response.content;

    console.log("AI response received");


    // Remove markdown JSON wrapper if model returns it
    const cleanedContent =
        content
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();


    let itinerary;

    try {

        itinerary = JSON.parse(cleanedContent);

    } catch (error) {

        console.error(
            "Invalid AI JSON:",
            error.message
        );

        throw new Error(
            "AI returned invalid itinerary JSON"
        );
    }


    return itinerary;
}