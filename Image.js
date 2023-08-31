const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    data: {
        type: Buffer,
        required: true,
    },
    contentType : {
        type: String,
        required: true,
    },
    title: {
        type: String,
        MaxLength: 50,
    },

    favourite: {
        type: Boolean,
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }

});


module.exports = mongoose.model('Image', imageSchema);