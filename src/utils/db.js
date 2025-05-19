import mongoose from "mongoose"

const mongoURI = process.env.MongoDB_URL

const connection = {}

async function connect() {
  if (connection.isConnected) {
    console.log("ALready Connected")
    return
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState
    if (connection.isConnected === 1) {
      console.log("Use previous connection")
      return
    }

    await mongoose.disconnect()
  }

  const db = await mongoose.connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  })

  console.log("New Connection")
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect()
      connection.isConnected = false
    } else {
      console.log("Not disconnected")
    }
  }
}

const db = { connect, disconnect }
export default db
