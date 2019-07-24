import { Injectable, Optional } from '@angular/core';

interface Player {
  position: number;
  remainingWalls: number;
  hasWon: (x: number) => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  edges: number[][]; // Array(81) for each square with inner arrays for neighbours
  player: Player;
  opponent: Player; // think I might have a separate graph service for oponent.
  players?: Player[]; // probably won't actually ever need to pass these in?

  constructor( @Optional()players?: Player[]) {
    this.edges = [];
    for (let i = 0; i < 81; i++) {
      this.edges.push(this.neighbours(i));
    }
    if (this.players ) {
      this.player = players[0];
      this.opponent = players[1];
    } else {
      this.player = {
        position: 4,
        remainingWalls: 10,
        hasWon: (pos: number) => pos > 70
      };
      this.opponent = {
        position: 76,
        remainingWalls: 10,
        hasWon: (pos: number) => pos < 9,
      }
    }
  }

  placeHorizontalWall(idx: number) {
    // walls are 8x8 and nodes 9x9, so indexes will be out by a row
    const row = Math.floor(idx/8);
    return this.placeWall(idx+row, idx+row+9, idx+row+1, idx+row+10);
  };

  placeVerticalWall(idx: number) {
    // verticals walls is 8x8 grid, indexes are orthogonal
    const row = idx % 8;
    const col = Math.floor(idx/8);
    const x = 9 * row + col;
    return this.placeWall(x, x+1, x+9, x+10)
  };

  /**
   * Removes edges between two sets of two nodes i -> j, j->i, k->l and l->k
   * but only if the resulting graph is legal, i.e. both pawns still have a path
   * to their opponenets end
   */
  private placeWall(i, j, k, l) {
    // need a deep copy of this.edges, so we can revert if the wall placement was illegal
    let edges = this.edges.map(x => ([...x]));
    this.removeEdge(i, j)
    this.removeEdge(k, l)
    if (this.wallBlocksPath()){
      this.edges = edges;
      return false;
    }
    return true;
  };

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
   * Return Array of indexes of neighbouring nodes in the inital graph
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

}
