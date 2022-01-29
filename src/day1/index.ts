import fs from 'fs'
import path from 'path'

const getInput = (filePath: string) =>
  fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(v => parseInt(v))

const input = getInput(path.resolve(__dirname, 'input.txt'))

/** --- */

const countMeasurementsIncreases = () => {
  let count = 0
  let previousValue = undefined

  for (const value of input) {
    if (previousValue !== undefined && value > previousValue) {
      count += 1
    }

    previousValue = value
  }

  return count
}

const result1 = countMeasurementsIncreases()

console.log({result1})

/** --- */

const countGroupMeasurementsIncreases = () => {
  let count = 0
  let valueGroup: number[] = []
  let currentGroupSum = 0
  let previousGroupSum = 0

  const sumGroup = () =>
    valueGroup.reduce((sum, currentValue) => sum + currentValue, 0)

  for (const index in input) {
    // make first group
    if (valueGroup.length < 3) {
      valueGroup.push(input[index])
    }

    // make every next group
    if (parseInt(index) > 2) {
      valueGroup.shift()
      valueGroup.push(input[index])
    }

    // sum group and count increases
    if (valueGroup.length === 3) {
      // set initial group sum
      if (parseInt(index) === 2) {
        const initialGroupSum = sumGroup()

        currentGroupSum = initialGroupSum
        previousGroupSum = initialGroupSum

        continue
      }

      currentGroupSum = sumGroup()

      if (currentGroupSum > previousGroupSum) {
        count += 1
      }

      previousGroupSum = currentGroupSum
    }
  }

  return count
}

const result2 = countGroupMeasurementsIncreases()

console.log({result2})
