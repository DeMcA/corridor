import { TestBed } from '@angular/core/testing';

import { GraphService } from './graph.service';

describe('GraphService', () => {
  let service: GraphService;
  beforeEach(() => { service = new GraphService(); });

  it('neighbours should stay within board', () => {
    expect(service.neighbours(0)).toEqual([1, 9]);
  });

  it('no path to end after walls inserted', () => {
    // Create a row of walls that boxes in player1 but leaves opponent a free path
    const edgesToRemove = [[10, 19]
                          ,[11, 20]
                          ,[12, 21]
                          ,[13, 22]
                          ,[14, 23]
                          ,[15, 24]
                          ,[16, 25]
                          ,[17, 26]
                          ,[0, 1]
                          ,[9, 10]
                          ]
    for (let [n1, n2] of edgesToRemove) {
      service.removeEdge(n1, n2);
    }
    expect(service.isPathToEnd(service.player)).toEqual(false);
    expect(service.isPathToEnd(service.opponent)).toEqual(true);
  })

  it('path to end after walls inserted', () => {
    // Create a row of walls that doesn't quite box in player 1
    const edgesToRemove = [[10, 19]
                          ,[11, 20]
                          ,[12, 21]
                          ,[13, 22]
                          ,[14, 23]
                          ,[15, 24]
                          ,[16, 25]
                          ,[17, 26]
                          ,[9, 10]
                          ,[18, 19]
                          ]
    for (let [n1, n2] of edgesToRemove) {
      service.removeEdge(n1, n2);
    }
    expect(service.isPathToEnd(service.player)).toEqual(true);
    expect(service.isPathToEnd(service.opponent)).toEqual(true);
  })

});
