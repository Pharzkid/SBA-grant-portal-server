const errorHandler = (err, req, res, next) => {
    // Determine the status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode);
    
    // Send back the error response
    res.json({
        message: err.message,
        // Only include stack trace if not in production mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { errorHandler };