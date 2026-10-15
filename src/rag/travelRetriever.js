import {getCollection} from './chroma.js'

export async function searchTravelKonwlegde(query,city,limit=5) {
    const collection = await getCollection();

    const result = await collection.query({
        queryTexts:[query],
        nResults:limit,
        where:{
            city:city
        }
    })

    return result.documents?.[0] || []
}