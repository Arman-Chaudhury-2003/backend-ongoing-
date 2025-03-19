// const asyncHandler = () => {};

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

//wrapper to not repeat db index.js again
//(req, res) into (err,req,res,next)
//const something=()=>()=>{}
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (err) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//     //when err is we send either err code if by user or 500 if by server
//we also send a json formated respose for err message
//   }
// };
