import {ChatOpenAI} from '@langchain/openai'
import OpenAILLM from './llm.js'

const llm = OpenAILLM;

export async function generateTravelKnowledge(city) {
        const prompt = `Generate travel knowledge for ${city}.

            Return JSON only.

            Include 20 important tourist places.

            For every place return:

            {
                "name": "",
                "category": "",
                "description": "",
                "history": "",
                "bestTime": "",
                "estimatedVisitHours": 0
            }

            Focus on useful information for a travel itinerary.
            `;

            const response = llm.invoke(prompt)
            return JSON.parse(response.content)
}