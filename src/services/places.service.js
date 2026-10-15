import { getCache, setCache } from "../cache/cacheService.js";
import axios from "axios";

async function getWikipediaThumbnail(placeName) {
    try {
        const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`;
        const response = await fetch(searchUrl);
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.thumbnail?.source || null;
    } catch (error) {
       
        return null;
    }
}

export async function getHistoricalPlaces(
    latitude,
    longitude
) {

    const cacheKey =
        `places:historical:${latitude}:${longitude}`;

    const cached = await getCache(cacheKey);

    if (cached) {
        console.log("Places cache HIT");
        return cached;
    }

    const categories =
        "tourism.sights,heritage";

    const url =
        `https://api.geoapify.com/v2/places` +
        `?categories=${categories}` +
        `&filter=circle:${longitude},${latitude},15000` +
        `&limit=20` +
        `&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Places API failed");
    }

    const data = await response.json();

    const places = await Promise.all(
    data.features.map(async (item) => {

        const properties = item.properties;
        

        const placeName =
            properties.name || "Unknown";

        const placeLatitude =
            item.geometry.coordinates[1];

        const placeLongitude =
            item.geometry.coordinates[0];

        let thumbnail = await getWikipediaThumbnail(placeName);
            
            // Fallback to placeholder if Wikipedia has no image
            if (!thumbnail) {
                thumbnail = `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(placeName)}`;
            }

        return {

            name: placeName,

            latitude:
                placeLatitude,

            longitude:
                placeLongitude,

            address:
                properties.formatted || null,

            tag:
                properties.historic?.type || null,

            short_add:
                [
                    properties.suburb,
                    properties.city,
                    properties.country
                ]
                    .filter(Boolean)
                    .join(", "),

            thumbnail: thumbnail,
        };
    })
    );

    // await setCache(
    //     cacheKey,
    //     places,
    //     86400
    // );

    return places;
}