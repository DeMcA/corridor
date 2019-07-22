import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  edges: number[][];

  constructor(
  ) {
    for (let i = 0; i++; i < 81) {
      this.edges.push(this.neigbours(i));
    }
  }

  /**
   * Return Array of indexes of neighbouring nodes in the graph
   */
  neigbours(node: number): number[] {
    const moves = [];
    // Only allows moves that wouldn't be off the side of the 9x9 grid
    if (node % 9 !== 0) { moves.push(-1); }
    if (node % 9 !== 8) { moves.push(1); }
    if (node > 8) { moves.push(-9); }
    if (node < 72) { moves.push(9); }
    return moves.map(m => m + node);
  }

  toIdx(coord: [number, number]): number {
    return coord[0] * 9 + coord[1];
  }

  toCoord(idx: number): [number, number] {
    return [Math.floor(idx / 9), idx % 9];
  }

  getMoves(player: number) {
    console.log('IN GRAPH SERVICE', player);
  }

}
