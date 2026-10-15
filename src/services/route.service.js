import {setCache,getCache} from '../cache/cacheService.js'

export async function getRoute({startLongitude,startLatitude,endLongitude,endLatitude,mode = "driving-car"}) {
    
    const CacheKey=`Route:${startLatitude}.${startLongitude}.${endLatitude}.${endLongitude}.${mode}`
    const cached = await getCache(CacheKey)

    if(cached){
        return cached
    }

    const url =
        `https://api.openrouteservice.org/v2/directions/${mode}` +
        `?start=${startLongitude},${startLatitude}` +
        `&end=${endLongitude},${endLatitude}`;

    const response = await fetch(url,{
        headers:{
            Authorization:process.env.OPENROUTESERVICE_API_KEY
        }
    })

    if(!response.ok){
        throw new Error("Route API Failed")
    }
    const data = await response.json();

     if (!data) {
        throw new Error("Route not found");
    }

    const route = {
        distance:
            data.features[0].properties.summary.distance,

        duration:
            data.features[0].properties.summary.duration,

        geometry:
            data.features[0].geometry
    };

    // await setCache(CacheKey,route,3600)

    return route
    
}