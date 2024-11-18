import { GRID_SIZE } from '../constants';

export function isAdjacent(pos1: number, pos2: number): boolean {
  const row1 = Math.floor(pos1 / GRID_SIZE.COLS);
  const col1 = pos1 % GRID_SIZE.COLS;
  const row2 = Math.floor(pos2 / GRID_SIZE.COLS);
  const col2 = pos2 % GRID_SIZE.COLS;

  return (
    (Math.abs(row1 - row2) === 1 && col1 === col2) ||
    (Math.abs(col1 - col2) === 1 && row1 === row2)
  );
}