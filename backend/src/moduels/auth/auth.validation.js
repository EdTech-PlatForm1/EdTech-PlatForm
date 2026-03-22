import joi from 'joi'
export const signup=joi.object().keys({
username:joi.string().min(3).max(40).required(),
email:joi.string().email({tlds:{allow:['com','net']},minDomainSegments:2,maxDomainSegments:3}).required(),
password:joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\w)(?!.* ).{8,16}$/)),
confirmationpassword:joi.string().valid(joi.ref('password')).required()
})

export const login=joi.object({
  email:joi.string().email().required(),
  password:joi.string().required(),
});