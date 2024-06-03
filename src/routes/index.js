import express from 'express';
import userRouter from './authRoute';

import eventRouter from './eventRoute';


const mainRouter = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/event',eventRouter);


export  default mainRouter;
