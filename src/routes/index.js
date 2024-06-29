import express from 'express';
import userRouter from './authRoute';
import caseRouter from './caseRoute';
import contactRouter from './contactRoute';


const mainRouter = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/case',caseRouter);
mainRouter.use('/cont',contactRouter);


export  default mainRouter;
