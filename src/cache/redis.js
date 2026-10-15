import {createClient} from 'redis'

const redisConnection = createClient({
    url:process.env.REDIS_URL
})

redisConnection.on('error',(err)=>{
    console.error(`Redis Error:`,err)
})

redisConnection.connect();

console.log(`Redis Connected`)

export default redisConnection