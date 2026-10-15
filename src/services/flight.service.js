import { setCache, getCache } from "../cache/cacheService.js";
import dotenv from 'dotenv'
dotenv.config();
export async function searchAirport(query) {
    try {
        const url = new URL(
            "https://google-flights2.p.rapidapi.com/api/v1/searchAirport"
        );

        url.searchParams.set("query", query);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "google-flights2.p.rapidapi.com"
            }
        });

        if (!response.ok) {
            throw new Error(
                `RapidAPI error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("searchAirport error:", error);
        throw error;
    }
}

export async function searchFlights({ from, to, travelDate }) {
    try {
        const cacheKey = `flight:${from}.${to}.${travelDate}`;

        // 1. Check cache
        const cached = await getCache(cacheKey);

        if (cached) {
            console.log("Flight data from cache");
            return cached;
        }

        // Find departure airport
        const fromAirport = await searchAirport(from);

        // Find arrival airport
        const toAirport = await searchAirport(to);

        const departure_id = fromAirport.data[0].list?.[0]?.id;
        const arrival_id = toAirport.data[0].list?.[0]?.id
        const url = new URL(
            "https://google-flights2.p.rapidapi.com/api/v1/searchFlights"
        );

        url.searchParams.set("departure_id", departure_id);
        url.searchParams.set("arrival_id", arrival_id);
        url.searchParams.set("outbound_date", travelDate);

        // Optional parameters
        // url.searchParams.set("adults", "1");
        url.searchParams.set("travel_class", "ECONOMY");
        url.searchParams.set("currency", "INR");

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "google-flights2.p.rapidapi.com"
            }
        });

        if (!response.ok) {
            throw new Error(
                `Flight API Error: ${response.status} ${response.statusText}`
            );
        }

        const result = await response.json();
       
        const flightData = result.data?.itineraries;

        return flightData;

    } catch (error) {
        console.error("searchFlights error:", error);

        throw new Error(
            `Failed to search flights from ${from} to ${to} on ${travelDate}`
        );
    }
}