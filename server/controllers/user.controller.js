import sendEmail from '../config/sendEmail.js';
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'; // Adjust path as needed
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';

const { hash } = bcryptjs;

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide name, email, and password",
                error: true,
                success: false
            });
        }

        // Check if the email already exists
        const user = await UserModel.findOne({ email });

        if (user) {
            return response.json({
                message: "Email is already registered",
                error: true,
                success: false
            });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // Create the user payload
        const payload = {
            name,
            email,
            password: hashPassword
        };

        // Save the new user to the database
        const newUser = new UserModel(payload);
        const save = await newUser.save();

        // Generate the email verification link
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

        // Prepare the email content using the email template
        const emailContent = verifyEmailTemplate({
            name,
            url: verificationUrl
        });

        // Send the email
        await sendEmail({
            sendTo: email,
            subject: "Verify your email for YumRunLK",
            html: emailContent
        });

        // Respond with success
        return response.json({
            message: "User registered successfully. Please verify your email.",
            error: false,
            success: true,
            data: save
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body
        const user = await UserModel.findOne({ _id: code });
       
        if(!user) {
            return response.status(400).json({
                message: "Invalid Code",
                error: true,
                success: false
            });
        }

        const updateUser = await UserModel.updateOne({ _id: code }, { verify_email: true });
        
        return response.json({
            message: "Email verified successfully",
            error: false,
            success: true,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })
    }
}


export async function loginController(request, response) {
     try {
         const { email, password } = request.body

         if (!email || !password) {
             return response.status(400).json({
                 message: "Provide email and password",
                 error: true,
                 success : false
             })
         }
         
         const user = await UserModel.findOne({ email })

         if (!user) {
             return response.status(400).json({
                    message: "Invalid email or password",
                    error: true,
                    success: false
             })
         }

         if (user.status !== "Active") {
             return response.status(400).json({
                    message: "Contact Admin",
                    error: true,
                    success: false
               })
}
         const checkPassword = await bcryptjs.compare(password, user.password)
         
         if (!checkPassword) {
             return response.status(400).json({
                    message: "Invalid password, check and try again",
                    error: true,
                    success: false
             })
         }

         const accessToken = await generatedAccessToken(user._id)
         const refreshToken = await generatedRefreshToken(user._id)

         const cookiesOption = {
             httpOnly: true,
             secure: true,
             sameSite: 'None'
         }
         response.cookie('accessToken', accessToken, cookiesOption)
         response.cookie('refreshToken', refreshToken, cookiesOption)

         return response.json({
             message: "Login Successfully",
             error: false,
             success: true,
             data: {
                 accessToken,
                 refreshToken
             }
        })

     } catch (error) {
         return response.status(500).json({
             message: error.message || error,
             error: true,
            success: false
        })
     }
}

export async function logoutController(request, response) {
    try {
        const userId = request.userId;
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };

        // Correct method is clearCookie (singular)
        response.clearCookie("accessToken", cookiesOption);
        response.clearCookie("refreshToken", cookiesOption);

        const removeRefreshToken = await UserModel.findByIdAndDelete(userId, {
             refresh_token : " "
         })
        return response.json({
            message: "Logout Successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

