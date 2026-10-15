import {z} from 'zod'

 const trainSchema = z.object({
    trainNumber:z.any(),
    trainName: z.any(),
    fromStation: z.any(),
    departureTime: z.any(),
    toStation: z.any(),
    arrivalTime:z.number(),
})

export const trainsSchema = z.array(trainSchema);