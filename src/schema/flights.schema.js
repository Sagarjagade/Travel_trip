import {z} from 'zod'

 const flightSchema = z.object({
  departure_airport: z.object({
    name: z.string().nullable(),
    id: z.string().nullable(),
    time: z.string().nullable()
  }),
  arrival_airport: z.object({
    name: z.string().nullable(),
    id: z.string().nullable(),
    time: z.string().nullable()
  }),
  airline: z.string().nullable(),
  flight: z.string().nullable(),
  booking_link: z.string().nullable(),
  airline_logo: z.string().nullable(),
  travel_class: z.string().nullable(),
  duration: z.string().nullable(),
  airplane: z.string().nullable(),
  extensions: z.any().nullable()
});


export const flightsSchema = z.array(flightSchema);