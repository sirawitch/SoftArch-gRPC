const mongoose = require('mongoose');
const MenuSchema = new mongoose.Schema({
    id:{
        type:String,
        required:[true,'Please add id']
    },
    name:{
        type:String,
        required:[true,'Please add name'],
        maxlength:[20,'Name cannot more than 20 characters']
    },
    price:{
        type: Number,
        required:[true,'Please add price'],
        minimum:0
    }
});
module.exports = mongoose.model('Menu',MenuSchema);