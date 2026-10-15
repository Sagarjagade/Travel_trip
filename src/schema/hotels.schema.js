import {z} from 'zod'

 const hotelSchema = z.object({
    hotel_name: z.string().nullable(),
    location: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    rating: z.number().nullable(),
    review_count: z.number().nullable(),
    price: z.number().nullable(),
    currency: z.string().nullable(),
    price_period: z.string().nullable(),
    hotel_photo: z.string().nullable(),
    booking_link: z.string().nullable(),
    hotel_website: z.string().nullable(),
    hotel_type: z.string().nullable(),
    star_rating: z.number().nullable(),
    amenities: z.array(z.string()),
    distance_from_center: z.string().nullable(),
    distance_from_beach: z.string().nullable(),
    recommendation_reason: z.string().nullable()
})

export const hotelsSchema = z.array(hotelSchema);