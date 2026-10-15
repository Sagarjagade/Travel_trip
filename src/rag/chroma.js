import {ChromaClient} from 'chromadb'
import {OpenAIEmbeddingFunction} from '@chroma-core/openai'
import dotenv from 'dotenv'
dotenv.config();

const client = new ChromaClient({
    path:process.env.CHROMA_URL
})

const embeddingsFunction = new OpenAIEmbeddingFunction({
    model: "text-embedding-3-small",
    temperature: 0.2,
    apiKey: process.env.OXYY_API_KEY,
    configuration: {
        baseURL: "https://api.oxyy.ai/v1"
    }
})

export async function getCollection() {
    return await client.getOrCreateCollection({
        name:"travel_knowledge",
        embeddingsFunction
    })
}