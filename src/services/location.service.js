import {setCache,getCache} from '../cache/cacheService.js'
import redisConnection from '../cache/redis.js';

export async function getLocation(city) {
     const cleanCity = city.trim();
    const cacheKey = `location:${cleanCity}`

    const data = await getCache(cacheKey)

    // if(data){
    //     console.log("cache to redis")
    //     return data;
    // }

    console.log("geolocation API Call")
    const url = `https://api.geoapify.com/v1/geocode/search` +
        `?text=${encodeURIComponent(cleanCity)}` +
        `&type=city&filter=countrycode:in&limit=1&format=json` +
        `&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    const response = await fetch(url)
    if(!response.ok){
        throw new Error("Geoapify API failed")
    }
    const data1 = await response.json();

    const result = data1?.results[0]
    
    if (!result) {
        throw new Error(`Location not found: ${cleanCity}`);
    }


    const location = {
        city:result.city || cleanCity,
        country:result.country,
        latitude: result.lat,
        longitude: result.lon
    }

    //await setCache(cacheKey,location,86400)
    return location
}