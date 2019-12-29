# Corridor TODO

* Install some linting/prettier tools on new computer and cleanup code
* Maybe an (optional) A\* shortest path display? (But could just focus doing a backend)  
* Add service to mock backend AI communication (can return random legal move for now)
* Encode board state efficiently (for the network). There may be some existing implementations
* Are there redundant event handlers? (why did I think this?) Any refactoring/rationalisation of codebase, names etc.
* Better tracking of game state. Maybe store moves in standard notation as well. This should help with undo

## Bugs

* Undo function incorrectly allocates walls
