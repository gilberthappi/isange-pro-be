import express from 'express';
import userRouter from './authRoute';
import caseRouter from './caseRoute';
import contactRouter from './contactRoute';
import blogRoute from './blogRoute';
import followUpRouter from './followUpRoutes';

const mainRouter = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/case',caseRouter);
mainRouter.use('/cont',contactRouter);
mainRouter.use('/blog',blogRoute);
mainRouter.use('/follow',followUpRouter);

export  default mainRouter;
