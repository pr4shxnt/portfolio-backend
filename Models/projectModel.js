const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    images:[
        {
            type: String,
            required: true
        }],
    technologies:[
        {
            type: String,
            required: true
        }],
    github:{
        type: String,
        required: true
    },
    live:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
})


module.exports =  mongoose.model('Project', projectSchema);