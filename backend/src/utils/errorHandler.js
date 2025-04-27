const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message); // always good to log it
  
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      // Bad JSON
      return res.status(400).json({
        success: false,
        message: "Invalid JSON payload",
      });
    }
  
    // Other unexpected errors
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  };
  
  module.exports = errorHandler;
  