import {setCache,getCache} from '../cache/cacheService.js'

export async function calculateBudget({totalBudget,days,travelers=1}) {
    
    const CacheKey = `budget:${totalBudget}.${days}.${travelers}`

    const cached = await getCache(CacheKey)
    if(cached){
        return cached
    }

    const perTravelerBudget =Math.round(totalBudget / travelers);

    const budget ={
        totalBudget,
        days,
        travelers,
        perTravelerBudget,
        transport: Math.round(totalBudget * 0.30),
        hotel: Math.round(totalBudget * 0.30),
        food: Math.round(totalBudget * 0.20),
        activities: Math.round(totalBudget * 0.10),
        emergency: Math.round(totalBudget * 0.10)
    }
    budget.perDay=Math.round(totalBudget / days)
    budget.perTravelerPerDay = Math.round(perTravelerBudget / days);
    // await setCache(CacheKey,budget,86400)

    return budget
}

