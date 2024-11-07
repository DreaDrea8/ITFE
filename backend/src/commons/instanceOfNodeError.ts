/**
 * Checks if an error instance matches the specified error type.
 * @template T - The error class type to check against.
 * @param {Error} value - The error instance to check.
 * @param {new (...args: any) => Error} errorType - The error class constructor to match against.
 * @returns {boolean} `true` if the error instance matches the error type; otherwise, `false`.
 * @author Joseph JDBar Barron
 * {@link https://dev.to/jdbar}
 */
const instanceOfNodeError = <T extends new (...args: any) => Error> (
  value: Error,
  errorType: T
): value is InstanceType<T> & NodeJS.ErrnoException => {
  return value instanceof errorType;
};

/**
 * Checks if a value is an instance of NodeJS.ErrnoException.
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is an instance of NodeJS.ErrnoException; otherwise, `false`.
 */
const instanceOfErrnoException =  (
  value: any
): value is NodeJS.ErrnoException => {
  return value instanceof Error; 
};

export {instanceOfErrnoException, instanceOfNodeError};