const mongoose = require('mongoose')
const touristData = require('./tourists')
const Tourist = require("../models/tourist")

// console.log(process.env.MONGO_URI)

async function main(){
    await mongoose.connect(process.env.MONGO_URI)
}

main().then(()=>{console.log("connected to DB")}).catch((err)=>{console.log("error occured", err)})

const initDB = async ()=>{
    await Tourist.deleteMany({});
    await Tourist.insertMany(touristData.touristData);
    console.log("data is initialized")
}
initDB()