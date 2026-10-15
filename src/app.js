import express from 'express'
import {ChatOpenAI} from '@langchain/openai'
import dotenv from 'dotenv'
import cors from 'cors'
import travelRoutes from './routes/trip.routes.js'
import userRoutes from './routes/user.routes.js'
import {notFoundHandler,errorHandler} from './middleware/error-handler.js'
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())

const llm = new ChatOpenAI({
    modelName: "qwen/qwen3.8-omni-flash:free", 
    temperature: 0.2,
    apiKey:process.env.XKIRO_API_KEY,
    configuration: {
        baseURL: "https://api.xkiro.com/v1",
    }
})

app.get("/test-ai",async(req,res)=>{
    try {
        const response = await llm.invoke(
            "Reply with only: OK"
        );

        console.log("LLM working:", response.content);
        return response.content == 'OK' ? 1 : 0;
    } catch (error) {
        console.error("LLM failed");
        console.error("Status:", error.status);
        console.error("Message:", error.message);
    }
})

app.get('/api/test_ai',(req,res)=>{
    console.log("test")
     res.status(200).json({
        message:"Ai Testing Proper"
    })
})

app.use('/api/ai/travel',travelRoutes);

app.use('/api/ai/user',userRoutes);

// 404 handler must come AFTER routes
app.use(notFoundHandler);
// Error handler must be LAST
app.use(errorHandler);

const PORT= process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})