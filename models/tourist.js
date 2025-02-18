const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
    tourist_name: {
        type:String,
        required:true
    },
    tourist_email: {
        type: String,
        required:true
    },
    tourist_city: {
        type: String,
    },
    tourist_image_url: {
        type: String
    },
    tourist_language: {
        type: String
    },
    tourist_native_place: {
        type: String
    }
});

const Tourist = mongoose.model('Tourist',touristSchema)

module.exports = Tourist;