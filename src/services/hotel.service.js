import {setCache,getCache} from '../cache/cacheService.js'
import {hotelsSchema} from '../schema/hotels.schema.js'
import OpenAILLM from '../ai/llm.js'

const model = OpenAILLM;
const structuredModel =
    model.withStructuredOutput(
        hotelsSchema
    );

export async function searchHotels({
    city,
    checkIn,
    checkOut,
    guests = 1
}) {

        const cacheKey =
        `hotel:${city}:${checkIn}:${checkOut}:${guests}`;

    // Check Redis cache
    const cached = await getCache(cacheKey);

    if (cached) {
        console.log("Hotel cache HIT");
        return cached;
    }

    const prompt = `Find all popular, highly rated and best-recommended hotels in ${city} for ${checkIn} to ${checkOut}. 
    Return JSON array only, ranked best first. Include: hotel_name, location, latitude, longitude, rating, review_count, price, currency, hotel_photo, booking_link, hotel_website, star_rating, amenities, recommendation_reason. 
    Use real data only. Do not invent details or URLs. Use null when unavailable. 
    Include all available hotels; do not limit results. booking_link must be a real booking-platform URL.`;

     const result = await structuredModel.invoke(prompt)
console.log("hotel_serive>>",result)
// return;
    // await setCache(
    //     cacheKey,
    //     hotels,
    //     3600
    // );

    return result;
    
}