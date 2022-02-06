import fs from 'fs';
import path from 'path';

const getInput = () =>
  fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8').split('\n');

const input = getInput();

/* --- Part One --- */

(function () {
  const expectedBinaryLength = input[0].length;
  const gammaRateBinaryStructure = Array(expectedBinaryLength)
    .fill(undefined)
    .map(() => ({ zeroCount: 0, oneCount: 0 }));

  input.forEach((binary, binaryIndex) => {
    if (binary.length !== expectedBinaryLength) {
      throw new Error(`Broken binary length on index ${binaryIndex}`);
    }

    binary.split('').forEach((value, index) => {
      if (value === '0' || value === '1') {
        if (value === '1') gammaRateBinaryStructure[index].oneCount += 1;
        if (value === '0') gammaRateBinaryStructure[index].zeroCount += 1;
      } else {
        throw new Error(`Broken binary value on index ${binaryIndex}`);
      }
    });
  });

  const gammaRateBinaryValue = gammaRateBinaryStructure
    .map(({ oneCount, zeroCount }) => (oneCount > zeroCount ? '1' : '0'))
    .join('');
  const epsilonRateBinaryValue = gammaRateBinaryValue
    .split('')
    .map((value) => (value === '1' ? '0' : '1'))
    .join('');

  console.log({
    result1:
      parseInt(gammaRateBinaryValue, 2) * parseInt(epsilonRateBinaryValue, 2),
  });
})();

/* --- Part One --- */

const findCommonValue = (
  input: string[],
  searchIndex: number,
  fallbackValue: string,
  mode: 'most' | 'least' = 'most',
) =>
  Object.entries(
    input.reduce<Record<string, number>>((result, currentValue) => {
      const indexedValue = currentValue.split('')[searchIndex];

      if (!indexedValue) {
        throw new Error('Given index does not exist');
      }

      if (!(indexedValue in result)) {
        result[indexedValue] = 0;
      }

      result[indexedValue] += 1;

      return result;
    }, {}),
  ).sort(([a, countA], [_, countB]) => {
    const result = mode === 'most' ? countB - countA : countA - countB;

    if (result === 0) {
      return a === fallbackValue ? -1 : 1;
    }

    return result;
  })[0][0];

(function () {
  const expectedBinaryLength = input[0].length;
  const iterateMock = Array(expectedBinaryLength)
    .fill(undefined)
    .map((_, index) => index);

  let scrubberRatingResult = input;
  let oxygenGeneratorRatingResult = input;

  while (
    scrubberRatingResult.length > 1 ||
    oxygenGeneratorRatingResult.length > 1
  ) {
    for (const index of iterateMock) {
      if (oxygenGeneratorRatingResult.length > 1) {
        const mostCommonValue = findCommonValue(
          oxygenGeneratorRatingResult,
          index,
          '1',
        );

        oxygenGeneratorRatingResult = oxygenGeneratorRatingResult.filter(
          (value) => value.charAt(index) === mostCommonValue,
        );
      }

      // FIXME: probably we can get those values during oxygenGeneratorRatingResult iteration
      // so I would't need to pass the union as mode to findCommonValue method,
      // but I didn't have time to check :)
      if (scrubberRatingResult.length > 1) {
        const leastCommonValue = findCommonValue(
          scrubberRatingResult,
          index,
          '0',
          'least',
        );

        scrubberRatingResult = scrubberRatingResult.filter(
          (value) => value.charAt(index) === leastCommonValue,
        );
      }
    }
  }

  console.log({
    result2:
      parseInt(oxygenGeneratorRatingResult[0], 2) *
      parseInt(scrubberRatingResult[0], 2),
  });
})();
