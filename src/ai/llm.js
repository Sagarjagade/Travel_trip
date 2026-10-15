import { ChatOpenAI } from "@langchain/openai";
import dotenv from 'dotenv'
dotenv.config();
const OpenAILLM = new ChatOpenAI({
     modelName: "qwen/qwen3.8-max:free", 
    temperature: 0.2,
    apiKey:process.env.XKIRO_API_KEY,
    configuration: {
        baseURL: "https://api.xkiro.com/v1",
    }
});

export default OpenAILLM