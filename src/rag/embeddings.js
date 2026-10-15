import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from 'dotenv'
dotenv.config();
export const embeddings =
    new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        temperature: 0.2,
        apiKey: process.env.OXYY_API_KEY,
        configuration: {
            baseURL: "https://api.oxyy.ai/v1"
        }
    });