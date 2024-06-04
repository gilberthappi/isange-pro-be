import express from 'express';
import userRouter from './authRoute';

import caseRouter from './caseRoute';


const mainRouter = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/case',caseRouter);


export  default mainRouter;
