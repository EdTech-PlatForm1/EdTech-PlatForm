import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { sendEmail } from "../email/send.email.js";
import { verificationemail } from "../email/template/verification.email.js";
import { usermodel } from "../../DB/model/user.model.js";
export const emailEvent=new EventEmitter({})


emailEvent.on("sendConfirmationEmail",async(data)=>{
    const{email}=data;
    const otp=customAlphabet("0123456789",6)()
    
    // Save OTP and expiry to user
    await usermodel.updateOne(
        { email }, 
        { 
            otp, 
            otpExpiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry
        }
    );
    
    const html=verificationemail({code:otp})
    await sendEmail({to:email,subject:"confirm email",otp,html})
    console.log("email send")
})