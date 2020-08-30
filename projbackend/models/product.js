const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema; //destructuring used! 
const productSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        trim:true,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:32
    },
    //category field is linked to previous schema
    category:{
        type:ObjectId,
        ref:"Category",//reference parameter given ie category.js in model.
        required:true
    },
    stock:{
        type:Number
    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,//datatype for photo
        contentType:String
    }
},{timestamps:true})

module.exports=mongoose.model("Product",productSchema);