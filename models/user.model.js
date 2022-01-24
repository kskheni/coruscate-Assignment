const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId
    }]
    
})

module.exports = mongoose.model("userInfo", userSchema);
