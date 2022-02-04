import fs from 'fs';
import path from 'path';

const DIRECTIONS = ['forward', 'down', 'up'] as const;

type Direction = typeof DIRECTIONS[number];

type Input = {
  direction: Direction;
  value: number;
};

const isValidDirection = (direction: string): direction is Direction =>
  DIRECTIONS.includes(direction as Direction);

const getInput = (): Input[] =>
  fs
    .readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map((v) => {
      const [direction, value] = v.split(' ');

      if (!isValidDirection(direction)) {
        throw new Error(`Unknown direction value called ${direction}`);
      }

      return {
        direction,
        value: parseInt(value),
      };
    });

const input = getInput();

const isUp = (direction: Direction) => direction === 'up';
const isDown = (direction: Direction) => direction === 'down';
const isForward = (direction: Direction) => direction === 'forward';

/* --- Part One --- */

const getPosition = () => {
  let depth = 0;
  let horizontalPosition = 0;

  for (const { direction, value } of input) {
    if (isForward(direction)) {
      horizontalPosition += value;
      continue;
    }

    if (isUp(direction)) {
      depth -= value;
      continue;
    }

    if (isDown(direction)) {
      depth += value;
    }
  }

  return horizontalPosition * depth;
};

console.log({ result1: getPosition() });

/* --- Part two --- */

const getPosition2 = () => {
  let aim = 0;
  let depth = 0;
  let horizontalPosition = 0;

  for (const { direction, value } of input) {
    if (isUp(direction)) {
      aim -= value;
      continue;
    }

    if (isDown(direction)) {
      aim += value;
      continue;
    }

    if (isForward(direction)) {
      horizontalPosition += value;

      if (aim !== 0) {
        depth += aim * value;
      }
    }
  }

  return horizontalPosition * depth;
};

console.log({ result2: getPosition2() });
