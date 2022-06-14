import vec2, { direction as dir } from "../vec2";
import ship from "./ship";

const getValidPos = (board) => {
  let pos;
  do {
    pos = vec2(
      Math.floor(Math.random() * board.size),
      Math.floor(Math.random() * board.size)
    );
  } while (!board.isValidMovePos(pos));

  return pos;
};

const getAdjacentPositions = (pos) => dir.indexed.map((dir) => pos.add(dir));

const getSmartPos = (board) => {
  const targetShip = board.ships.find(
    (ship) => ship.hits.length > 0 && !ship.isSunk()
  );

  if (!targetShip) {
    return getValidPos(board);
  }

  if (targetShip.hits.length === 1) {
    const validAdjacentPositions = getAdjacentPositions(
      targetShip.hits[0]
    ).filter(board.isValidMovePos);

    if (validAdjacentPositions.length > 0) {
      return validAdjacentPositions[
        Math.floor(Math.random() * validAdjacentPositions.length)
      ];
    }
  } else if (targetShip.hits.length > 1) {
    const possiblePositions = [
      targetShip.hits[0].add(targetShip.rotation.multiply(vec2(-1, -1))),
      targetShip.hits[targetShip.hits.length - 1].add(targetShip.rotation),
    ].filter(board.isValidMovePos);

    if (possiblePositions.length > 0) {
      return possiblePositions[
        Math.floor(Math.random() * possiblePositions.length)
      ];
    }
  }

  return getValidPos(board);
};

const getValidShip = (board, shipLength) => {
  if (board.size < shipLength) {
    throw new Error(
      `Cannot get valid ship of length ${shipLength} from board of length ${board.size}`
    );
  }

  let possibleShip;
  let i = 0;
  const MAX_ITERATIONS = 999;
  do {
    possibleShip = ship(
      shipLength,
      getValidPos(board),
      dir.indexed[Math.floor(Math.random() * dir.indexed.length)]
    );
    i++;
  } while (!board.isValidShip(possibleShip) && i < MAX_ITERATIONS);

  if (i >= MAX_ITERATIONS) {
    console.log(
      "Could not find valid position to place ship! There are likely not enough free positions on the board"
    );
    return;
  }

  return possibleShip;
};

const getShips = (startingBoard) => {
  let board = startingBoard;
  const shipLengths = [5, 4, 3, 3, 2];
  const ships = [];
  for (let i = 0; i < shipLengths.length; i++) {
    const newShip = getValidShip(board, shipLengths[i]);
    ships.push(newShip);
    board = board.addShip(newShip);
  }

  return ships;
};

export { getValidPos, getSmartPos, getValidShip, getShips };
