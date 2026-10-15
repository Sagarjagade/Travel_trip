import {z} from 'zod'

export const travelPlanSchema = z.object({
    summary:z.string(),
    itinerary:z.array(
            z.object({
                day:z.number(),
                date:z.string(),
                title:z.string(),
                activities:z.array(
                    z.object({
                        time:z.string(),
                        place:z.string(),
                        description:z.string(),
                        estimatedCost:z.number(),
                        location: z.object({
                            latitude: z.number(),
                            longitude: z.number()
                        }),
                        distance: z.object({
                            value: z.number(),
                            unit: z.string()
                        }),
                        directions: z.object({
                            from: z.string(),
                            to: z.string(),
                            mode: z.string(),
                            duration: z.string(),
                            distance: z.string()
                        }),
                        map: z.object({
                            googleMapsUrl: z.string(),
                            openStreetMapUrl: z.string()
                        }),
                         images: z.object({
                            mobile: z.array(z.string()),
                            laptop: z.array(z.string())
                        })
                    })
                ),
                meals:z.array(z.string()),
                localTransport:z.string(),
            })
    ),
    tips: z.array(z.string()),
    location: z.any(),

    weather: z.any(),

    trains: z.any(),

    flight: z.any(),

    travelers:z.number(),

    hotel: z.object({
    available: z.boolean(),

    data: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                address: z.string(),
                rating: z.number(),
                starRating: z.number(),
                pricePerNight: z.number(),
                currency: z.string(),
                image: z.string(),
                url: z.string()
            })
        )
    }),

    places: z.any(),

    route: z.any(),

    budget: z.any(),
})