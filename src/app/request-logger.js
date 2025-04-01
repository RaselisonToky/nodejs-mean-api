import moment from 'moment';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  console.log(
    `\n${moment().format('YYYY-MM-DD HH:mm:ss')}: ${req.method} ${req.originalUrl} - Request started`
  );

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    console.log(
      `${moment().format('YYYY-MM-DD HH:mm:ss')}: ${req.method} ${req.originalUrl} - Status: ${status} - Duration: ${duration}ms`
    );
  });
  next();
};

