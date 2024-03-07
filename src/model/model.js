const mongoose=require("mongoose")
const bookModel=mongoose.Schema({
    bookName:String,
    category:String

})
module.exports=mongoose.model("book store",bookModel)