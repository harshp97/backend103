import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
dotenv.config()

const app = express();

// Construct the CORS options dynamically from the environment variable
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {  // also allow requests with no origin
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

//routes
import userRouter from './routes/user.routes.js';
import patientRouter from './routes/patient.routes.js';
import visitRouter from './routes/visit.routes.js';
import pendingRouter from './routes/pending.routes.js';


//routes decleration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/visits", visitRouter)
app.use("/api/v1/patients", patientRouter)
app.use("/api/v1/pendings", pendingRouter)

export { app }