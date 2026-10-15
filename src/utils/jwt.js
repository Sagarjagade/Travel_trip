import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({ path: `${process.cwd()}/.env` })

const generateJWTToken = (id) => {
    const access_token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "15m"
    })

    const refresh_Token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    return { access_token, refresh_Token }
}

const verifyJWTToken = (req, res, next) => {
    try {
        let token = ""
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            throw new Error("Please Provide the Token")
        }

        const user = jwt.verify(token, process.env.JWT_SECRET)

        req.user = user

        next()
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//generate Refersh Token 
const generateNewRefreshToken = (refresh_Token) => {
    try {

        const decoded = jwt.verify(
            refresh_Token,
            process.env.JWT_SECRET
        );

        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        return {
            accessToken: accessToken
        }
    } catch (err) {

        return res.status(401).json({
            message: "Invalid Refresh Token"
        });

    }
}

export {
    generateJWTToken,
    verifyJWTToken,
    generateNewRefreshToken
}