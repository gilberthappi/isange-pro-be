/* eslint-disable func-names */
export const myLogger = function (req, res, next) {
  console.log(req.body);
  next();
};