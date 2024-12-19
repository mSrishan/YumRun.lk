import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js' 
import bcryptjs, { hash } from 'bcryptjs'

export async function registerUserController(response, request) {
    try {
        const { name, email, password } = request.body
        
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide name, email, password",
                error: true,
                success: false
            })
        }
        //check excisting email
        const user = await UserModel.findOne({ email })
        
        if (user) {
            return response.json({
                message: "Already registered email",
                error: true,
                success: false
            })
        }


        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()
      
        const verifyEmailTemplate = '${process.env.FRONTEND_URL}/verify-email?code=${save?._id}'

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify email from YumRunLK",
            html: verifyEmailTemplate({
                name,
                url : verifyEmailTemplate
            })
        })

        return response.json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: save
        })

    } catch (error) {
        return response.status(500).jason({
            message: error.message || error,
            error: true,
            success: false
       })
    }
}