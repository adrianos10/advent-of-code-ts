import fs from 'fs'
import path from 'path'

const DIRECTIONS = ['forward', 'down', 'up'] as const

type Direction = typeof DIRECTIONS[number]

type Input = {
  direction: Direction
  value: number
}

const isValidDirection = (direction: string): direction is Direction =>
  DIRECTIONS.includes(direction as Direction)

const getInput = (): Input[] =>
  fs
    .readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(v => {
      const [direction, value] = v.split(' ')

      if (!isValidDirection(direction)) {
        throw new Error(`Unknown direction value called ${direction}`)
      }

      return {
        direction,
        value: parseInt(value),
      }
    })

const input = getInput()

/* --- Part One --- */

const getPosition = () => {
  let depth = 0
  let horizontalPosition = 0

  const isUp = (direction: Direction) => direction === 'up'
  const isDown = (direction: Direction) => direction === 'down'
  const isForward = (direction: Direction) => direction === 'forward'

  for (const {direction, value} of input) {
    if (isForward(direction)) {
      horizontalPosition += value
    }

    if (isUp(direction)) {
      depth -= value
    }

    if (isDown(direction)) {
      depth += value
    }
  }

  return {
    depth,
    horizontalPosition,
  }
}

const {depth, horizontalPosition} = getPosition()

console.log({depth, horizontalPosition})

const result1 = horizontalPosition * depth

console.log({result1})
