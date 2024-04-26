import { createClient } from 'redis'

const client = createClient({
  url: 'redis://localhost:6379', // replace with your url, if different
})

client.on('connect', function () {
  console.log('Connected to Redis')
})

client.on('error', function (err) {
  console.log('Redis error: ' + err)
})

export default client
