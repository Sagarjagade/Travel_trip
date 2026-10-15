import { getLocation } from "./location.service.js";
import { getWeather } from "./weather.service.js";
import { getHistoricalPlaces } from "./places.service.js";
import { getRoute } from "./route.service.js";
import { searchTrains } from "./train.service.js";
import { searchFlights } from "./flight.service.js";
import { searchHotels } from "./hotel.service.js";
import { calculateBudget } from "./budget.service.js";
import { logger } from "../utils/logger.js";

export async function buildTripContext(trip) {

    console.log("Building trip context...");

    // // 1. Get source and destination coordinates
    const [source, destination] =
        await Promise.allSettled([
            getLocation(trip.from),
            getLocation(trip.to)
        ]);
        
    // // 2. Get destination information
    let weather = {};

    try {

        weather = await getWeather(
            destination.value.latitude,
            destination.value.longitude
        );

    } catch (error) {

        logger.error(
            "Weather unavailable:",
            error.message
        );

        weather = {
            available: false,
            message: "Weather data unavailable"
        };
    }


    let places = [];

    try {

        places = await getHistoricalPlaces(
            destination.value.latitude,
            destination.value.longitude
        );

    } catch (error) {

        logger.error(
            "Places unavailable:",
            error.message
        );

        places = [];
    }

    // // 3. Route
     let route = null;
     
    try{
       route = await getRoute({
        startLongitude: source.value.longitude,
        startLatitude: source.value.latitude,
        endLongitude: destination.value.longitude,
        endLatitude: destination.value.latitude
       });
    }catch(error){
        logger.error(
            "Route unavailable:",
            error.message
        );

        route = {
            available: false,
            message: "Route data unavailable"
        };
    }
    

    // 4. Transport
    let TrainstransportOptions = [];

    try{
            TrainstransportOptions =
                await searchTrains({
                    from: trip.from,
                    to: trip.to,
                    travelDate: trip.startDate
                });

    }catch(error){
        logger.error(
            "Transport unavailable:",
            error.message
        );

        TrainstransportOptions = [];
    }

    //flight    
    let flighttransportOptions = [];

    try{
           
            flighttransportOptions =
                await searchFlights({
                    from: trip.from,
                    to: trip.to,
                    travelDate: trip.startDate
                });
    }catch(error){
        logger.error(
            "flight Transport unavailable:",
            error.message
        );

        flighttransportOptions = [];
    }

    // 5. Hotels
    let hotels =[];

    function getCheckOutDate(startDate, days) {

        const date = new Date(startDate);

        date.setDate(
            date.getDate() + days - 1
        );

        return date.toISOString().split("T")[0];
    }


    try{
        const checkOut = getCheckOutDate(
            trip.startDate,
            trip.days
        );


         hotels = await searchHotels({
            city: trip.to,
            checkIn: trip.startDate,
            checkOut,
            guests: trip.travelers || 1
        });
    }catch(error){

        logger.error(
            "hotels unavailable:",
            error.message
        );

        hotels=[]
    }
   
    //6. Budget
    const budgetResult = await calculateBudget({
            totalBudget: trip.budget,
            days: trip.days,
            travelers:trip.travelers
        });
    
        if (!budgetResult) {
        return {
            success: false,
            message: "Trip exceeds the requested budget.",
            budget: budgetResult.budget,
            estimated: budgetResult.estimated,
            exceededBy: Math.abs(budgetResult.remaining),
            breakdown: budgetResult.breakdown
        };
    }
    
    return {
        success: true,
        trip: [{
            from: trip.from,
            to: trip.to,
            days: trip.days,
            budget: trip.budget,
            transport: trip.transport,
            hotel: trip.hotel,
            interests: trip.interests,
            startDate: trip.startDate,
            endDate: trip.endDate
        }],

        location: [{
            from: source,
            to: destination
        }],

        trains: TrainstransportOptions,

        flights: flighttransportOptions,

        route:[route],

        weather:[weather],

        places,

        hotel: hotels,

        budget:[budgetResult]
    };
}