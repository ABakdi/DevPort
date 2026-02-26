import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI!
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var mongoClient: Promise<MongoClient> | undefined
}

if (!global.mongoClient) {
  client = new MongoClient(uri, options)
  global.mongoClient = client.connect()
}

clientPromise = global.mongoClient

export { clientPromise }
