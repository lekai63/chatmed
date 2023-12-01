/**
 * Logs messages only in development environment.
 * @param  {...any} args - Arguments to log.
 */
const devLog = (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  }
  
  export default devLog;