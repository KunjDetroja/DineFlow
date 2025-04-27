const successResponse = (res, data, message, status_code = 200) => {
  return res
    .status(status_code)
    .json({ data, message: message, success: true, status_code: status_code });
};

const errorResponse = (res, status_code, message) => {
  console.log("Error:", message);
  return res.status(status_code).json({ message: message, success: false ,status_code: status_code });
};

const catchResponse = (res) => {
  console.log("Catch Error");
  return res
    .status(500)
    .json({ message: "Internal Server Error", success: false, status_code: 500 });
};

module.exports = {
  successResponse,
  errorResponse,
  catchResponse,
};
