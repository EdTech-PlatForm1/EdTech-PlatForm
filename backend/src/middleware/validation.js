export const validation=(schema)=>{
return (req,res,next)=>{
    const inputdata={...req.body,...req.params,...req.query}
    const validation=schema.validate(inputdata,{abortEarly:false})
    if(validation.error){
        return res.status(400).json({message:"validation error",details:validation.error})
    }
    return next()
 }
}

export default validation