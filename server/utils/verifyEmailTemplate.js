const verifyEmailTemplate = ({ name, url }) => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #4caf50; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Welcome to YumRunLK!</h1>
            </div>
            <div style="padding: 20px;">
                <p>Dear <strong>${name}</strong>,</p>
                <p>Thank you for registering on <strong>YumRunLK</strong>. We're excited to have you join our community!</p>
                <p>To complete your registration, please verify your email by clicking the button below:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${url}" style="display: inline-block; background-color: #4caf50; color: white; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Verify Your Email
                    </a>
                </div>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br><strong>The YumRunLK Team</strong></p>
            </div>
            <div style="background-color: #f8f8f8; color: #666; padding: 10px; text-align: center; font-size: 12px; border-top: 1px solid #ddd;">
                <p style="margin: 0;">© 2024 YumRunLK. All rights reserved.</p>
                <p style="margin: 0;">Visit us at <a href="${process.env.FRONTEND_URL}" style="color: #4caf50; text-decoration: none;">YumRunLK</a></p>
            </div>
        </div>
    `;
};

export default verifyEmailTemplate;
