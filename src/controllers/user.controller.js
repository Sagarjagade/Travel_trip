

import bcrypt from 'bcrypt'
import {generateJWTToken} from '../utils/jwt.js'
import User from '../db/models/users.js'
import RefreshTokens from '../db/models/refresh_token.js'

const UserSignup = async(req,res)=>{
    try{
        const {first_name,last_name,email,mobile,password,confirm_password} = req.body;

        const checkMobileExist = await User.findOne({
                where: { mobile }
            })

        if(checkMobileExist){
            return res.status(409).json({
                message: "Mobile already used. Please try a different mobile number."
            });
        }

        if(password != confirm_password){
           return res.status(400).json({
                message: "Password and confirm password don't match."
            });
        }

        const passwordHash = await bcrypt.hash(password,10);

        const userinfo = await User.create({
            first_name,last_name,email,mobile,password:passwordHash
        })

        const id = userinfo.id;
        const { access_token, refresh_Token } =  generateJWTToken(id);
        
        await RefreshTokens.create({
            user_id: userinfo.id,
            token: refresh_Token,
            expires_at: new Date()
        })

        return res.status(200).json({
            message: "User registered successfully",
            data: [{
                id: userinfo.id,
                email: userinfo.email,
                name: userinfo.name,
                access_token: access_token,
                refresh_Token: refresh_Token
            }]
        })
        
    }catch(error){
       
        return res.status(500).json({
            message:error.message
        })
    }
}

const Userlogin = async(req,res)=>{
    try{
        const {mobile,password} = req.body;

        const user =await User.findOne({
                    where: { mobile }
                })

        if(!user){
            return res.status(409).json({
                message: "Mobile number doesn't exits."
            });
        }
       

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            throw new Error("Password Doesn't matched")
        }

        const token = generateJWTToken(user.id);

        await RefreshTokens.create({
            user_id: user.id,
            token: token.refresh_Token,
            expires_at: new Date()
        })

        return res.status(200).json({
            message:"Login Successfully",
            data: [{
                id: user.id,
                token: token
            }]
        })


    }catch(error){
       
        return res.status(500).json({
            message:error.message
        })
    }
}

export {
    UserSignup,
    Userlogin
}