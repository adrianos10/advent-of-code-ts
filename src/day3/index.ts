import fs from 'fs';
import path from 'path';

const getInput = () =>
  fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8').split('\n');

const input = getInput();

(function () {
  const expectedBinaryLength = input[0].length;
  const gammaRateBinaryStructure = Array.from(
    { length: expectedBinaryLength },
    () => ({ zeroCount: 0, oneCount: 0 }),
  );

  input.forEach((binary, index) => {
    if (binary.length !== expectedBinaryLength) {
      throw new Error(`Broken binary length on index ${index}`);
    }

    binary.split('').forEach((value, index) => {
      if (value === '0' || value === '1') {
        if (value === '1') gammaRateBinaryStructure[index].oneCount += 1;
        if (value === '0') gammaRateBinaryStructure[index].zeroCount += 1;
      } else {
        throw new Error(`Broken binary value on index ${index}`);
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
