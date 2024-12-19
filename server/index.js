import cors from 'cors';
import express, { request, response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet, { crossOriginResourcePolicy } from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
dotenv.config();

const app = express();
app.use(cors(
    {
        credentials: true,
        origin:process.env.FRONTEND_URL
    }
));

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(cookieParser());

const PORT = 8080 || process.env.PORT;

app.get("/", (request, response) => {
    response.json({
        message: "Server is running."+ PORT
    })
})

app.use('/api/user', userRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
});

