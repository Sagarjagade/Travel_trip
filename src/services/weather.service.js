import {setCache,getCache} from '../cache/cacheService.js'

export async function getWeather(latitude, longitude) {
    const CacheKey = `weather:${latitude}.${longitude}`

    const data = await getCache(CacheKey)

    if(data){
        return data
    }

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=auto`;
        const response = await fetch(url)
        if(!response.ok){
            throw new Error("Weather API failed")
        }

        const result = await response.json();
        // await setCache(CacheKey,result,1800)
        return result
}

