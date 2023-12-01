/**
 * Logs messages only in development environment.
 * @param  {...unknown} args - Arguments to log.
 */
const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export default devLog;
