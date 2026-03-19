
import { usermodel } from "../../DB/model/user.model.js";
import { emailEvent } from "../../utils/events/email.event.js";
import { asynchandler } from "../../utils/response/error.response.js";
import { generateHash } from "../../utils/security/hash.security.js";
import { compareHash } from "../../utils/security/token.js";
import { generateToken } from "../../utils/security/token.js";
import bcrypt from 'bcrypt'

export const signup=asynchandler (
    async(req,res,next)=>{
  const {username,email,password}=req.body
if(await usermodel.findOne({email})){
    return next(new Error("email exist",{cause:409}))
}

const hashpassword=generateHash({plainText:password})
const user=await usermodel.create({username,email,password:hashpassword})
emailEvent.emit("sendConfirmationEmail",{email})
  return res.status(200).json({message:"done",user})
})



export const login = asynchandler(
  async (req, res, next) => {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user){
      return next(new Error("invalid email or password",{cause:400}));
    }
    const match = compareHash({ plainText: password, hashValue: user.password });
    if (!match) {
      return next(new Error("invalid email or password", { cause: 400 }));
    }
    const accessToken = generateToken({
      payload: { id: user._id, email: user.email },
      signature: process.env.ACCESS_TOKEN_SIGNATURE,
      expiresIn: "7d",
    });
    const refreshToken = generateToken({
      payload: { id: user._id },
      signature: process.env.REFRESH_TOKEN_SIGNATURE,
      expiresIn: "7d",
    });
    return res.status(200).json({
      message: "login success",
      accessToken,
      refreshToken,
    });
  }
);
export const getUsers = asynchandler(
  async (req, res, next) => {

    const users = await usermodel.find().select("-password");

    return res.status(200).json({
      message: "done",
      results: users.length,
      users
    });

  }
);
export const getUser = asynchandler(
  async (req, res, next) => {
    const { id } = req.params;
    const user = await usermodel.findById(id).select("-password");
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
    return res.status(200).json({
      message: "done",
      user
    });
  }
);
export const updateUser = asynchandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { username, email } = req.body;
    const user = await usermodel.findByIdAndUpdate(
      id,
      { username, email },
      { new: true}
    ).select("-password");
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
    return res.status(200).json({
      message: "user updated",
      user
    });
  }
);
export const deleteUser = asynchandler(
  async (req, res, next) => {
    const { id } = req.params;
    const user = await usermodel.findByIdAndDelete(id);
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
    return res.status(200).json({
      message: "user deleted"
    });
  }
);