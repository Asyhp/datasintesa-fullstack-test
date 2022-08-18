const mongoose = require('mongoose');

const csvSchema = new mongoose.Schema({
    resultTime: {
        type: Date,
    },
    objectName: {
        type: String,
    },
    availDur: {
        type: String,
    }
});

module.exports = mongoose.model('raw_data', csvSchema)