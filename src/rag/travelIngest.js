import { getCollection } from "./chroma.js";
import { generateTravelKnowledge } from "../ai/travelKnowledge.js";

export async function ingestCityKnowledge(city) {

    const collection = await getCollection();

    const places = await generateTravelKnowledge(city);

    const documents = [];
    const ids = [];
    const metadatas = [];

    for (const place of places) {

        const document = `
        Place: ${place.name}

        City: ${city}

        Category: ${place.category}

        Description:
        ${place.description}

        History:
        ${place.history}

        Best Time:
        ${place.bestTime}

        Estimated Visit Duration:
        ${place.estimatedVisitHours} hours
                `.trim();

        documents.push(document);

        ids.push(
            `${city.toLowerCase()}-${place.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`
        );

        metadatas.push({
            city,
            place: place.name,
            category: place.category
        });
    }

    await collection.add({
        ids,
        documents,
        metadatas
    });

    console.log(
        `${places.length} travel places added for ${city}`
    );
}