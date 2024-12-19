import sendEmail from '../config/sendEmail.js';
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'; // Adjust path as needed

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
