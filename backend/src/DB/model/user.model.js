import mongoose, { model, Schema ,Types} from "mongoose";

const gendertype={male:'male',female:'female'}
const roletype={user:'user',admin:'admin'}
export const userschema=new Schema({
username:{
    type:String,
    required:true,
    trim:true,
    minlength:3,
    maxlength:40
},
password:{
type:String,
    required:true,
    trim:true,
    minlength:4,
    maxlength:1024, 
}, 
email:{
    type:String,
    required:true,
    trim:true,
},
otp:String,
DOB:Date,
phone:String,
image:String,
confirmEmail:{
    type:Boolean,
    default:false
},
gender:{
type:String,
enum:Object.values(gendertype),
default:gendertype.male
},
role:{
type:String,
enum:Object.values(roletype),
default:roletype.user
},


},{timestamps:true})

export const usermodel = mongoose.models.User || model("User", userschema);
