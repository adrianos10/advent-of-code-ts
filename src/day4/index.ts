import fs from 'fs';
import path from 'path';

type BoardNumber = { value: number; isMarked: boolean };
type BoardRowOrCol = BoardNumber[];
type Board = {
  rows: BoardRowOrCol[];
  cols: BoardRowOrCol[];
};

const numbers = fs
  .readFileSync(path.resolve(__dirname, 'numbers.txt'), 'utf-8')
  .split(',')
  .filter(Boolean)
  .map((value) => parseInt(value));

const boards = fs
  .readFileSync(path.resolve(__dirname, 'boards.txt'), 'utf-8')
  .split('\n')
  .filter(Boolean)
  .reduce<Board[]>((result, _, index, input) => {
    if (index !== 0 && index % 5 === 0) {
      result.push(
        input.slice(index - 5, index).reduce<Board>(
          (boardShape, value, index, preFormattedBoard) => {
            boardShape.rows.push(
              value
                .split(' ')
                .filter(Boolean)
                .map((singleNumber) => ({
                  value: parseInt(singleNumber),
                  isMarked: false,
                })),
            );
            boardShape.cols.push(
              preFormattedBoard
                .map((singleRow) => singleRow.split(' ').filter(Boolean)[index])
                .map((singleNumber) => ({
                  value: parseInt(singleNumber),
                  isMarked: false,
                })),
            );

            return boardShape;
          },
          { rows: [], cols: [] },
        ),
      );
    }

    return result;
  }, []);

/* --- Part One --- */

(function () {
  const createNumberMarker =
    (currentNumber: number) => (rowsOrCols: BoardRowOrCol[]) =>
      rowsOrCols.map((row) =>
        row.map((singleRowNumber) =>
          !singleRowNumber.isMarked
            ? {
                ...singleRowNumber,
                isMarked: currentNumber === singleRowNumber.value,
              }
            : singleRowNumber,
        ),
      );
  const hasBingoIn = (rowsOrCols: BoardRowOrCol[]) =>
    rowsOrCols.some((row) => row.every(({ isMarked }) => isMarked));
  const getWinnersScore = (board: Board, currentNumber: number) =>
    [
      ...new Set(
        [...board.rows.flat(), ...board.cols.flat()]
          .filter(({ isMarked }) => !isMarked)
          .map(({ value }) => value),
      ),
    ].reduce((sum, currentValue) => sum + currentValue) * currentNumber;

  for (const currentNumber of numbers) {
    const markNumbersIn = createNumberMarker(currentNumber);

    for (const board of boards) {
      board.rows = markNumbersIn(board.rows);
      board.cols = markNumbersIn(board.cols);

      if (hasBingoIn(board.rows) || hasBingoIn(board.cols)) {
        console.log({
          score: getWinnersScore(board, currentNumber),
          winnerIndex: boards.indexOf(board),
        });
        return;
      }
    }
  }
})();

/* --- Part TWO --- */

// TODO
