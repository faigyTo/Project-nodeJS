//import library
import express from 'express';
import { config } from 'dotenv';
import cors from'cors';

//import pages
import { connectToDB } from './config/dbConfig.js';
import productRouter from './routs/productRouts.js';
import userRouter from './routs/userRouts.js' ;
import orderRouter from './routs/orderRouts.js';
import { errorHandling } from './middleware/errorHandlingMiddleware.js';

//code
config();

const app=express();
app.use(cors({origin:'http://localhost:3000'}));
connectToDB();
app.use(express.json());
app.use('/api/products',productRouter);
app.use('/api/users',userRouter);
app.use('/api/orders',orderRouter);
app.use(errorHandling);

let port=process.env.PORT||4000;
app.listen(port,()=>{console.log(`app is listening on port ${port}`);});
