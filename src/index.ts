import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import morgan from "morgan"
import helmet from 'helmet';
import mongooSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import compression from 'compression';
import cors from 'cors';
import createHttpError from "http-errors";
import { Server } from "socket.io";


import logger from './config/logger';
import router from './routes/index.routes';
import SockerServer from './SockerServer';
dotenv.config();
const app = express();



if (process.env.NODE_ENV !== 'production') {
   app.use(morgan("dev"))
}
app.use(helmet())
const PORT = process.env.PORT || 6969;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(mongooSanitize())

app.use(cookieParser())

app.use(compression())

app.use(fileUpload({ useTempFiles: true }))

app.use(cors({ origin: true, credentials: true }))

// ==>connect to database 
mongoose.connection.on('error', (err) => {
   logger.error("Error database is ==> ", err);
   process.exit(1);
})
if (process.env.NODE_ENV !== "production") {
   mongoose.set('debug', true);
}
mongoose.connect(process.env.DATABASE_URL as string, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
} as ConnectOptions).then(() => {
   logger.info("Connect to database successfully")
})

// ==> start server
let server: any;
server = app.listen(PORT, () => {
   logger.info(`Server is running on port ${PORT}`)
})

app.use('/api/v1', router)

// ==> handle error
app.use(async (req, res, next) => {
   next(createHttpError.NotFound("This route does not exist."));
});

app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
   if (Array.isArray(err)) {
      res.status(err[0].status || 500).json({
         error: err
      })
   }
   else {
      res.status(err.status || 500).json({
         error: [
            {
               message: err.message || "Internal Server Error",
               path: err.path || "Server",
               status: err.status || 500
            }
         ]
      })
   }
})
// ==> socket io
const io = new Server(server, {
   pingTimeout: 60000,
   cors: {
      origin: process.env.CLIENT_ENDPOINT,
      // methods: ["GET", "POST"]
   }
});

io.on("connection", (socket) => {
   logger.info("Socket connected: " + socket.id);
   SockerServer(socket, io);
})

// ==> handle unexpected error resolution
const exitHandler = () => {
   if (server) {
      logger.info("Server closed.");
      process.exit(1);
   } else {
      process.exit(1);
   }
};

const unexpectedErrorHandler = (error: string) => {
   logger.error(error);
   exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
//SIGTERM
process.on("SIGTERM", () => {
   if (server) {
      logger.info("Server closed.");
      process.exit(1);
   }
});
