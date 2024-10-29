
/**
 * Generates a sequence of numbers within a specified range.
 * @generator
 * @param {number} [start=0] - The start of the range (inclusive). Default is 0.
 * @param {number} [end=1000000000] - The end of the range (inclusive). Default is 1000000000.
 * @param {number} [step=1] - The step or increment between each number in the sequence. Default is 1.
 * @yields {number|true} The next number in the sequence or `true` when the sequence is complete.
 */
export function* range(start = 0, end = 1000000000, step = 1): Generator<number, void, number>{
  for (let i = start; i <= end; i = i + step) {
    yield i;
  }
};

export const LogId = range();