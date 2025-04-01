
import moment from 'moment';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const inf = '[INFO] ';
  console.log(
    `\n${inf}${moment().format('YYYY-MM-DD HH:mm:ss')}: ${req.method} ${req.originalUrl} - Request started`
  );

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const inf2 = '[INFO] ';
    console.log(
      `${inf2}${moment().format('YYYY-MM-DD HH:mm:ss')}: ${req.method} ${req.originalUrl} - Status: ${status} - Duration: ${duration}ms`
    );
  });
  next();
}

