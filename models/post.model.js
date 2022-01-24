const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageName:{
        type: String,
        required: true
    },
    title:{
        type: String
    },
    nameOfCreator:{
        type: String,
        required: true
    },
    likedBy:[{
        type: mongoose.Schema.Types.ObjectId
    }]
})

module.exports = mongoose.model('postInfo',postSchema);