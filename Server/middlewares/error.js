function error(err,req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Something failed: Internal Server Error."
  console.log(err.message);
  return  res.status(status).send({
    success:false,
    status:status,
    message:message
  });
}
module.exports = error;

