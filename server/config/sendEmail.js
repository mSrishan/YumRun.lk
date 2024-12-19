import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();


const resend = new Resend(process.env.RESEND_API);

if (!process.env.RESEND_API) {
    console.log('Please provide a Resend API key in the .env file');
}
const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
        from: 'YumRunLK <onboarding@resend.dev>',
        to: sendTo,
        subject: subject,
        html: html,
        });
          if (error) {
            return console.error({ error });
        }
        
    return data;

    } catch (error) {
        console.log(error);
    }
}

export default sendEmail;