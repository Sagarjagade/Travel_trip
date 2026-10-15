import redisClient from '../cache/redis.js';

export async function getCache(key){
    
    const data = await redisClient.get(key)

    if(!data){
        return null
    }

    return JSON.parse(data)
}

export async function setCache(key,data,ttl=3000) {

    await redisClient.set(key,JSON.stringify(data),{
        EX:ttl
    })
}