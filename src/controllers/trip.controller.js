import { success } from "zod";
import { generateTravelPlan } from "../ai/agent.js";
import { buildTripContext } from "../services/tripContext.service.js";
export async function createTravelPlan(req,res,next) {
    
    try {
        const tripContext =await buildTripContext(req.body);
       
        if (!tripContext.success) {

            return tripContext;
        }
       
        const aiPlan = await generateTravelPlan(tripContext);

       return res.json({
            success: true,
            data: {

                location:
                    tripContext.location,

                weather:
                    tripContext.weather,

                trains:
                    tripContext.trains,

                flight:
                    tripContext.flights,

                hotel:
                    tripContext.hotel,

                places:
                    tripContext.places,

                route:
                    tripContext.route,

                budget:
                    tripContext.budget,

                itinerary:
                    aiPlan.itinerary,

                summary:
                    aiPlan.summary,

                tips:
                    aiPlan.tips
            }
        });

    } catch (error) {

        next(error);

    }
}

export async function saveTripPlan(req,res,next){
   
    try{
        let {plan_info,location,weather,trains,flight,hotel,places,route,budget,itinerary,summary,tips}=req.body;

        // Save Trip information
        const loc = Array.isArray(location) ? location[0] : location;

        if (!plan_info || !loc?.from?.value || !loc?.to?.value) {
            return res.status(400).json({
                success: false,
                message: "Plan information and source/destination are required"
            });
        }
        
            let tripData = {
                user_id:req.user.id,
                from_station_city:location.from.value.city,
                from_station_country:location.from.value.country,
                to_station_city:location.to.value.city,
                to_station_country:location.to.value.country,
                budget:plan_info.budget,
                start_date:plan_info.start_date,
                end_date:plan_info.end_date,
                travellers:plan_info.travelers,
                status:2 // 1 -completed,2 - upcoming
            }
            const query = `Insert into trip(user_id,from_station_city,from_station_country,to_station_city,to_station_country,budget,start_date,end_date,traveller,status,createdAt,updatedAt) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;
            const values = [
                tripData.user_id,
                tripData.from_station_city,
                tripData.from_station_country,
                tripData.to_station_city,
                tripData.to_station_country,
                tripData.budget,
                tripData.start_date,
                tripData.end_date,
                tripData.travellers,
                tripData.status
            ];

            const tripInfo = await Pool.query(query,values);

            if(tripInfo.rowCount==0){
                return res.status(500).json({
                    success: false,
                    message: "Failed to save trip"
                });
            }

            //save weather
            let weatherInfo=null;
            if(!weather || weather.length == 0){
                let weatherData = {
                    user_id:req.user.id,
                    trip_id:tripInfo.rows[0].id,
                    weather_data:weather,
                    fetched_at:new Date(),
                    next_refresh_at: new Date(Date.now() + 6 * 60 * 60 * 1000)
                }
                const weather_query = `Insert into trips-weather-data(user_id,trip_id,weather_data,fetched_at,next_refersh_at) values ($1, $2, $3, $4, $5) RETURNING *`;
                const weather_values = [
                    weatherData.user_id,
                    weatherData.trip_id,
                    JSON.stringify(weatherData.weather_data),
                    weatherData.fetched_at,
                    weatherData.next_refresh_at
                ];

                 weatherInfo = await Pool.query(weather_query,weather_values);
            }

            //save Train data
            let trainsInfo = null;
            if(!trains || trains.length==0){
                let trainsData = {
                    user_id:req.user.id,
                    trip_id:tripInfo.rows[0].id,
                    train_data:trains,
                    fetched_at:new Date(),
                    next_refresh_at: new Date(Date.now() + 6 * 60 * 60 * 1000)
                }
                const trains_query = `Insert into trips-train-data(user_id,trip_id,train_data,fetched_at,next_refersh_at) values ($1, $2, $3, $4, $5) RETURNING *`;
                const trains_values = [
                    trainsData.user_id,
                    trainsData.trip_id,
                    JSON.stringify(trainsData.train_data),
                    trainsData.fetched_at,
                    trainsData.next_refresh_at
                ];

                 trainsInfo = await Pool.query(trains_query,trains_values);
            }

            //save Train data
            let flightInfo = null;
            if(!flight || flight.length==0){
                let flightsData = {
                    user_id:req.user.id,
                    trip_id:tripInfo.rows[0].id,
                    flight_data:flight,
                    fetched_at:new Date(),
                    next_refresh_at: new Date(Date.now() + 6 * 60 * 60 * 1000)
                }
                const flights_query = `Insert into trips-flight-data(user_id,trip_id,flight_data,fetched_at,next_refersh_at) values ($1, $2, $3, $4, $5) RETURNING *`;
                const flights_value = [
                    flightsData.user_id,
                    flightsData.trip_id,
                    JSON.stringify(flightsData.flight_data),
                    flightsData.fetched_at,
                    flightsData.next_refresh_at
                ];

                 flightInfo = await Pool.query(flights_query,flights_value);
            }

            //save hotel data
            let hotelInfo = null;
            if(!hotel || hotel.length==0){
                let hotelsData = {
                    user_id:req.user.id,
                    trip_id:tripInfo.rows[0].id,
                    hotel_data:hotel,
                    fetched_at:new Date(),
                    next_refresh_at: new Date(Date.now() + 6 * 60 * 60 * 1000)
                }
                const hotels_query = `Insert into trips-flight-data(user_id,trip_id,hotel_data,fetched_at,next_refersh_at) values ($1, $2, $3, $4, $5) RETURNING *`;
                const hotels_value = [
                    hotelsData.user_id,
                    hotelsData.trip_id,
                    JSON.stringify(hotelsData.flight_data),
                    hotelsData.fetched_at,
                    hotelsData.next_refresh_at
                ];

                 hotelInfo = await Pool.query(hotels_query,hotels_value);
            }

            //save route data
            let routeInfo = null;
            if(!route || route.length==0){
                let routesData = {
                    user_id:req.user.id,
                    trip_id:tripInfo.rows[0].id,
                    route_data:route,
                    fetched_at:new Date(),
                    next_refresh_at: new Date(Date.now() + 6 * 60 * 60 * 1000)
                }
                const routes_query = `Insert into trips-route-data(user_id,trip_id,route_data,fetched_at,next_refersh_at) values ($1, $2, $3, $4, $5) RETURNING *`;
                const routes_value = [
                    routesData.user_id,
                    routesData.trip_id,
                    JSON.stringify(routesData.route_data),
                    routesData.fetched_at,
                    routesData.next_refresh_at
                ];

                 routeInfo = await Pool.query(routes_query,routes_value);
            }

            //save place data
            let placeInfo = null
            if(!places || places.length==0){
                let placesData = {
                    user_id:req.user.id,
                    trip_id:tripInfo.rows[0].id,
                    place_data:places,
                    fetched_at:new Date(),
                    next_refresh_at: new Date(Date.now() + 6 * 60 * 60 * 1000)
                }
                const places_query = `Insert into trips-place-data(user_id,trip_id,place_data,fetched_at,next_refersh_at) values ($1, $2, $3, $4, $5) RETURNING *`;
                const places_value = [
                    placesData.user_id,
                    placesData.trip_id,
                    JSON.stringify(placesData.place_data),
                    placesData.fetched_at,
                    placesData.next_refresh_at
                ];

                 placeInfo = await Pool.query(places_query,places_value);
            }

            //save budget data
            let budgetInfo = null
            if(!budget || budget.length==0){
                let budgetsData = {
                    user_id:req.user.id,
                    trip_id:tripInfo.rows[0].id,
                    budget_data:budget,
                    fetched_at:new Date(),
                    next_refresh_at: new Date(Date.now() + 6 * 60 * 60 * 1000)
                }
                const budget_query = `Insert into trips-budget-data(user_id,trip_id,budget_data,fetched_at,next_refersh_at) values ($1, $2, $3, $4, $5) RETURNING *`;
                const budget_value = [
                    budgetsData.user_id,
                    budgetsData.trip_id,
                    JSON.stringify(budgetsData.budget_data),
                    budgetsData.fetched_at,
                    budgetsData.next_refresh_at
                ];

                 budgetInfo = await Pool.query(budget_query,budget_value);
            }

            //save itinerary data
            let itineraryInfo = null;
            if(!itinerary || itinerary.length==0){
                let itineraryData = {
                    user_id:req.user.id,
                    trip_id:tripInfo.rows[0].id,
                    budget_data:budget,
                    fetched_at:new Date(),
                    next_refresh_at: new Date(Date.now() + 6 * 60 * 60 * 1000)
                }
                const itinerary_query = `Insert into trips-itinerary-data(user_id,trip_id,itinerary_data,fetched_at,next_refersh_at) values ($1, $2, $3, $4, $5) RETURNING *`;
                const itinerary_value = [
                    itineraryData.user_id,
                    itineraryData.trip_id,
                    JSON.stringify(itineraryData.itinerary_data),
                    itineraryData.fetched_at,
                    itineraryData.next_refresh_at
                ];

                 itineraryInfo = await Pool.query(itinerary_query,itinerary_value);
            }


            let summaryData = {
                    user_id:req.user.id,
                    trip_id:tripInfo.rows[0].id,
                    summary_data:summary,
                    tips_data:tips,
                    fetched_at:new Date(),
                    next_refresh_at: new Date(Date.now() + 6 * 60 * 60 * 1000)
                }
                const summary_tip_query = `Insert into trips-summary_tips-data(user_id,trip_id,itinerary_data,tips_data,fetched_at,next_refersh_at) values ($1, $2, $3, $4, $5) RETURNING *`;
                const summary_tip_value = [
                    summaryData.user_id,
                    summaryData.trip_id,
                    JSON.stringify(summaryData.summary_data),
                    JSON.stringify(summaryData.tips_data),
                    summaryData.fetched_at,
                    summaryData.next_refresh_at
                ];

            let summaryInfo = await Pool.query(summary_tip_query,summary_tip_value);


            return res.status(201).json({
                success: true,
                message:"Travel Plan Store Successfully",
                location:tripInfo.rowCount,
                weather:weatherInfo?.rowCount ?? 0,
                itineraryInfo :itineraryInfo?.rowCount ?? 0,
                trainsInfo:trainsInfo?.rowCount ?? 0,
                flightInfo:flightInfo?.rowCount ?? 0,
                hotelInfo:hotelInfo?.rowCount ?? 0,
                placeInfo:placeInfo?.rowCount ?? 0,
                routeInfo:routeInfo?.rowCount ?? 0,
                budgetInfo:budgetInfo?.rowCount ?? 0,
                summaryInfo:summaryInfo?.rowCount ?? 0

            })

            // list api - upcoming and completed
            // list api based id
            //planner api -show itenirary
            
            
     
    }catch(e){
       return res.status(500).json({
            success: false,
            message: "Failed to save Travel plan"
        });
    }
}

export async function tripList(req,res,next){
    try{
        const query = `select from_station_city,to_station_city,start_date,to_date,travellers,status from trip`;

        const info = await Pool.query(query,[]);

        return res.status(200).json({
            success:true,
            data:info.rowCount > 0 ? info.rows : []
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Failed to trip list"
        })
    }
}

export async function tripListBasedId(req,res,next){
    try{
        let {id}=req.body;
        const userId = req.user.id;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID",
            });
            }
            
        const tripquery = `select t.from_station_city,t.to_station_city,t.start_date,t.to_date,t.travellers,t.status from trips as t 
                        where t.id = $1 and t.user_id = $2`;

        const tripInfo = await Pool.query(tripquery,[id,userId]);

        const flightquery = `select * from trips-flight-data where user_id=$1 and trip_id = $2`;
        const flightInfo = await Pool.query(flightquery,[userId,id])

        const trainsquery = `select * from trips-train-data where user_id=$1 and trip_id = $2`;
        const trainsInfo = await Pool.query(trainsquery,[userId,id])

        const hotelquery = `select * from trips-hotel-data where user_id=$1 and trip_id = $2`;
        const hotelInfo = await Pool.query(hotelquery,[userId,id])

        const placequery = `select * from trips-place-data where user_id=$1 and trip_id = $2`;
        const placeInfo = await Pool.query(placequery,[userId,id])

        const budgetquery = `select * from trips-budget-data where user_id=$1 and trip_id = $2`;
        const budgetInfo = await Pool.query(budgetquery,[userId,id])

        const itineraryquery = `select * from trips-itinerary-data where user_id=$1 and trip_id = $2`;
        const itineraryInfo = await Pool.query(itineraryquery,[userId,id])

        const weatherquery = `select * from trips-weather-data where user_id=$1 and trip_id = $2`;
        const weatherInfo = await Pool.query(weatherquery,[userId,id])

        const summaryquery = `select * from trips-summary-data where user_id=$1 and trip_id = $2`;
        const summaryInfo = await Pool.query(summaryquery,[userId,id])

        return res.status(200).json({
            success:true,
            data:[
                tripInfo.rowCount>0 ? tripInfo.rows : [],
                trainsInfo.rowCount>0 ? trainsInfo.rows : [],
                flightInfo.rowCount>0 ? flightInfo.rows : [],
                weatherInfo.rowCount>0 ? weatherInfo.rows : [],
                hotelInfo.rowCount>0 ? hotelInfo.rows : [],
                placeInfo.rowCount>0 ? placeInfo.rows : [],
                budgetInfo.rowCount>0 ? budgetInfo.rows : [],
                itineraryInfo.rowCount>0 ? itineraryInfo.rows : [],
                summaryInfo.rowCount>0 ? summaryInfo.rows : []

            ]
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Failed to trip list"
        })
    }
}

export async function tripPlannerBasedId(req,res,next) {
    try{
        let {id}=req.body;
       const itineraryquery = `select * from trips-itinerary-data where user_id=$1 and trip_id = $2`;
        const itineraryInfo = await Pool.query(itineraryquery,[req.user.id,id])

        return res.status(200).json({
            success:true,
            data:[
                itineraryInfo.rowCount>0 ? itineraryInfo.rows : []
            ]
        })


    }catch(e){
        return res.status(500).json({
            success:false,
            message:"Failed to trip planner"
        })
    }
}