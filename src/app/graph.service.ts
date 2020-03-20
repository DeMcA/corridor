import { Injectable, Optional, Inject } from '@angular/core';

export interface Player {
  key: number;
  position: number;
  walls: number;
  hasWon: (x: number) => boolean;
}
interface GraphState {
  verticalWalls: number[];
  horizontalWalls: number[];
  edges: number[][];
  player?: Player;
  opponent?: Player;
}

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  edges: number[][]; // Array(81) for each square with inner arrays for neighbours
  _player: Player;
  _opponent: Player; // think I might have a separate graph service for opponent.
  players?: Player[]; // probably won't actually ever need to pass these in?
  adjacentPawns: boolean;
  // Note using 9x9 to make node checks easier. Don't have to check gaps since this is done in Board
  verticalWalls = new Array(81).fill(0);
  horizontalWalls = new Array(81).fill(0);
  graphHistory: GraphState[] = new Array();

  constructor( @Optional() @Inject('players') players?: Player[]) {
    this.edges = [];
    for (let i = 0; i < 81; i++) {
      this.edges.push(this.neighbours(i));
    }
    if (this.players ) {
      this._player = players[0];
      this._opponent = players[1];
    } else {
      this._player = {
        key: 1,
        position: 4,
        walls: 10,
        hasWon: (pos: number) => pos > 70
      };
      this._opponent = {
        key: 2,
        position: 76,
        walls: 10,
        hasWon: (pos: number) => pos < 9,
      }
    }
  }


  get player() { return this._player};
  get opponent() {return this._opponent};

  /**
   * Assumes player is a legal Player object and player.position is accessible from current position
   */
  set player(player) {
    this.graphHistory.push(this.createGraphSate());
    this.updateJumpsOnPawnMove(player.position, this.player.position, this.opponent.position)
    this._player = Object.assign({}, player); // TODO: doing this again in createGraphSate
  }

  set opponent(opponent) {
    this.graphHistory.push(this.createGraphSate());
    this.updateJumpsOnPawnMove(opponent.position, this.opponent.position, this.player.position)
    this._opponent = Object.assign({}, opponent);
  }

  isSquareAdjacentToPawn (newSqIdx: number, existingPawn: number) {
    return this.edges[existingPawn].indexOf(newSqIdx) > -1
  }

  /**
   * For when you can't rely on existing connectivity
   */
  areSquaresAdjacent (node1: number, node2: number) {
    const diff = Math.abs(node1 - node2);
    if (diff === 1 || diff == 9) return !this.isWallBetween(node1, node2);
    return false;
  }

  isWallBetween(node1: number, node2: number): boolean {
    const diff = node2 - node1;
    switch (diff) {
      case 9:
        return !!this.horizontalWalls[node1];
      case -9:
        return !!this.horizontalWalls[node2];
      case 1:
        let row = Math.floor(node1 / 9);
        let col = node1 % 9;
        return !!this.verticalWalls[9*col+row];
      case -1:
        const row2 = Math.floor(node2 / 9);
        const col2 = node2 % 9;
        return !!this.verticalWalls[9*col2+row2];
      default:
        return false;
    }
  }

  /**
   * return true if node1 is between node2 and a wall
   */
  isSquareBetweenWall(node1: number, node2: number) {
    return this.isWallBetween(node1, node1 + (node1 - node2));
  }

  removeJumps(sqIdx: number) {
    const edges = this.edges[sqIdx];
    this.edges[sqIdx] = edges.filter((i) => {
      const delta = Math.abs(sqIdx - i);
      return delta === 9 || delta === 1;
    })
  }

  addJumps(fromSq: number, jumpSq: number) {
    // remove non-jumping connection if it exists
    let arr = this.edges[fromSq];
    const idx = arr.indexOf(jumpSq);
    if (idx > -1 ) {
      arr.splice(idx, 1);
    }

    // helper to check the square being jumped actually has an edge to the destination square
    // (might not if at side of board or there are walls in the way)
    const addTheJump = (toSq) =>  {
      if (this.edges[jumpSq].indexOf(toSq) > -1) {
        arr.push(toSq)
      }
    }

    // When there's a wall behind the square being jumped, add diagonal jumps
    if (this.isSquareBetweenWall(jumpSq, fromSq)) {
      const delta = Math.abs(fromSq - jumpSq);
      if (delta === 1) {
        addTheJump(jumpSq + 9)
        addTheJump(jumpSq - 9)
      }
      if (delta === 9) {
        addTheJump(jumpSq + 1)
        addTheJump(jumpSq - 1)
      }
    } else {
      // Simple jump over other pawn
      addTheJump(jumpSq + (jumpSq - fromSq));
    }
  }

  /**
   * Remove jumps between squares and re-adds simple connectivity
   */
  resetJumps(node1: number, node2: number) {
    this.removeJumps(node1)
    this.removeJumps(node2)
    // re-add simple connectivity, which must have existed before it was replaced with a jump
    this.edges[node1].push(node2)
    this.edges[node2].push(node1)
  }

  updateJumpsOnPawnMove(newSq, oldSq, oppSq) {
    // check if pawns were previously adjacent:
    if (this.areSquaresAdjacent(oldSq, oppSq)) {
      this.resetJumps(oldSq, oppSq);
    }
    // can do simpler adjacency check to new position since jumps have already been reset
    if (this.isSquareAdjacentToPawn(newSq, oppSq)) {
      // now add any jumps to the occupied squares accounting for walls behind
      // (can't be walls in between)
      this.addJumps(newSq, oppSq)
      this.addJumps(oppSq, newSq)
    }
  }

  placeHorizontalWall(idx: number, checkPath = true) {
    const state = this.createGraphSate();
    // walls are 8x8 in Board and nodes 9x9, so indexes will be out by a row
    const row = Math.floor(idx/8);
    this.horizontalWalls[idx+row] = 1;
    this.horizontalWalls[idx+row+1] = 1;
    if (this.placeWall(idx+row, idx+row+9, idx+row+1, idx+row+10, checkPath)) {
      this.graphHistory.push(state);
      return true;
    }
    // restore from previous state since we only want this.horizontalWalls mutated if placement is legal
    this.horizontalWalls = state.horizontalWalls;
    return false;
  };

  placeVerticalWall(idx: number, checkPath = true) {
    const state = this.createGraphSate();
    // verticals walls is 8x8 grid, indexes are orthogonal
    const row = idx % 8;
    const col = Math.floor(idx/8);
    const x = 9 * row + col;
    this.verticalWalls[idx+col] = 1;
    this.verticalWalls[idx+col+1] = 1;

    if (this.placeWall(x, x+1, x+9, x+10, checkPath)) {
      this.graphHistory.push(state); 
      return true;
    }
    this.verticalWalls = state.verticalWalls;
    return false;
  };

  /**
   * Removes edges between two sets of two nodes i -> j, j->i, k->l and l->k
   * but only if the resulting graph is legal, i.e. both pawns still have a path
   * to their opponents end
   */
  private placeWall(i, j, k, l, checkPath = true) {
    // need a deep copy of this.edges, so we can revert if the wall placement was illegal
    let edges = checkPath && this.edges.map(x => ([...x]));
    // remove jumps if wall is between
    this.removeEdge(i, j)
    this.removeEdge(k, l)
    this.updateJumpsOnWallPlacement();
    if (checkPath && this.wallBlocksPath()){
      this.edges = edges;
      return false;
    }

    return true;
  };

  private createGraphSate() {
    return {
      verticalWalls: this.verticalWalls.map(x => x),
      horizontalWalls: this.horizontalWalls.map(x => x),
      edges: this.edges.map(x => ([...x])),
      player: Object.assign({}, this._player),
      opponent: Object.assign({}, this._opponent),
    }
  }

  updateJumpsOnWallPlacement(){
    this.removeJumps(this.opponent.position);
    this.removeJumps(this.player.position);
    // No connectivity between already adjacent pawns, so check via areSquaresAdjacent()
    if (this.areSquaresAdjacent(this.player.position, this.opponent.position)) {
      // want to remove jumps if wall is between squares
      // removeJumps() removes jumps even if the wall is elsewhere on board
      // but since addJumps() already checks for wall location,
      // its easier to re-add than deduce all the scenarios in which edges must be removed
      this.addJumps(this.opponent.position, this.player.position)
      this.addJumps(this.player.position, this.opponent.position)
      // Could check how efficient this is and refactor if necessary
    }
  }

  removeEdge (node1: number, node2: number) {
    this.edges[node1] = this.edges[node1].filter(n => n !== node2);
    this.edges[node2] = this.edges[node2].filter(n => n !== node1);
  }

  wallBlocksPath(): boolean {
    return !this.isPathToEnd(this.player) || !this.isPathToEnd(this.opponent);
  }

  isPathToEnd(player: Player) {
    let stack = [player.position];
    const discovered  = new Set();
    while (stack.length > 0) {
      const pos = stack.pop();
      if (player.hasWon(pos)) {
        return true
      };
      discovered.add(pos);
      stack = stack.concat(this.edges[pos].filter(node => !discovered.has(node)));
    }
    return false;
  }

  /**
   * Return Array of indexes of neighbouring nodes in the initial graph
   */
  neighbours(node: number): number[] {
    const moves = [];
    // Only allows moves that wouldn't be off the side of the 9x9 grid
    if (node % 9 !== 0) { moves.push(node - 1); }
    if (node % 9 !== 8) { moves.push(node + 1); }
    if (node > 8) { moves.push(node - 9); }
    if (node < 72) { moves.push(node + 9); }
    return moves;
  }

  private recreateGraph(graphState: GraphState) {
    this._player = graphState.player;
    this._opponent = graphState.opponent;
    this.verticalWalls = graphState.verticalWalls
    this.horizontalWalls = graphState.horizontalWalls
    this.edges = graphState.edges
  }

  public undoLastMove() {
    this.recreateGraph(this.graphHistory.pop());
    // this.recreateGraph(this.opponent, this.player, this.graphHistory.pop())
  }

}
