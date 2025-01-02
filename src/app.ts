import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import router from './app/routes'
import { io } from './server'

const app: Application = express()
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5173/",
      "http://localhost:5174",
      "http://localhost:5174/",
      "http://localhost:3000",
      "http://localhost:3000/",
      "https://pamojafm.world",
      "https://pamojafm.world/",
      "http://pamojafm.world",
      "http://pamojafm.world/",
      "https://www.pamojafm.world",
      "https://www.pamojafm.world/",
      "http://www.pamojafm.world",
      "http://www.pamojafm.world/",
    ],
    credentials: true,
  })
);
app.use(cookieParser())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use('/api/v1/', router)
app.use(globalErrorHandler)

//Testing
app.get('/', (req: Request, res: Response) => {
  res.send('Working Successfully')
})

app.post("/send", (req, res) => {
  const message = req.body.message;
  console.log("message:", message);

  // Emit message to all connected clients
  io.emit("pushNotification", { message });

  res.status(200).send({
      message: "Sent Successfully"
  });
});



app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})
export default app
