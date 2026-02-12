const userModel = require("../models/user.model")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")



 const registerController =  async (req,res)=>{
    //destructuring user data from req.body
   const {username,email,password,bio,profileImage} =  req.body

  const isUserAlreadyExist = await userModel.findOne(
    {
        //$or-->agar database me ya tuh username mila same ya tuh email mila same donu me se koi bhi mila tuh vo data return hoga database se
        $or: [
               {username},
               {email}  
        ]
    })
    //agar user database me exist krta hoga
    if(isUserAlreadyExist){
        return res.status(409).json({
            message:"user already exist"+ 
            //isse pata chaljayega ki kya field database me exist krti hai (username ya email)
            (isUserAlreadyExist.username==username?"username already exist":"user email already exist")
        })
    }

    //agar user exist nhi karta hu user ka data savekaro database me
    //1)hast password save krna db me
    const hashPassword = crypto.createHash("sha256").update(password).digest("hex")
    
    //2)user ka jo data aya hai use database me create kro and save kro
    const user = await userModel.create({
        username,
        email,
        password:hashPassword,
        bio,
        profileImage
    })

    //3)user ka data ke sath ab token create kro
    //token me user ka vo data jayega jo en donu condition ko satisfy krega
    //1-->user ka data hona cahiye
    //2--->user ka vo data unique hona chahiye
    //ye donu condition tuh sirf (user._id )hi satify krti hai
    const token = jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_SECRET,
       { expiresIn:"1d"}
    )

    //4)ab es token ko res me client ke cookie storage me save krdo
    res.cookie("JWT_TOKEN",token)
    res.status(201).json({
        message:"user registered successfully",
        email:user.email,
        username:user.username,
        bio:user.bio,
        profileImage:user.profileImage
    })

}

const loginController = async (req,res)=>{
    const {username , email , password} = req.body

  

     //ye neeche jo code hai ye vo vala feature hai ki user ya tuh (username+password) dalke lhin hojaye ya (email+password) dalke login hojaye
    //email ya username jo bhi exist krta hoga db me usko return krega $or + password leke login hoga user
    const user = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    }) 
    //agar donu me se koi bhi match nhi hua database ke (username ya email) se tuh user doesnot exist
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }
    //jo bhi field phele database me se match hogi server usko lelega
    //ab user ka password phele hash me conver kro
    const hashPassword = crypto.createHash("sha256").update(password).digest("hex")

    //ab es hashpassword  ko database ke hashpassword se matych kro
    if(hashPassword != user.password){
        return res.status(404).json(
            {
                message:"Invalid Password"
            }
        )
    }

    // hashpassword match ho gya database ke password (user.password) se abuser ka token create kro
    const token = jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_SECRET
    )

    res.cookie("JWT_TOKEN", token)
    res.status(201).json({
        message:"User login successfully",
        username:user.username,
        email:user.email,
        bio:user.bio,
        profileImage:user.profileImage,
        UserCredentials:(user.username==user.username?"User ne username + password se login kra":"user ne email + password se login kara")
    })

   

}



module.exports = {registerController , loginController}