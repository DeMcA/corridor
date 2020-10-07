# Corridor

So, I made this mainly because I was joining a project at work that was using Angular as a frontend
framework and I wanted to get a bit of experience using it myself. I picked
[Quoridor](https://en.wikipedia.org/wiki/Quoridor) since a friend had recently introduced me to it
and it seemed like a fun game to implement. I had actually been playing around with a (very, very
basic) AI for the game, before throwing it all away and focussing on the frontend. Maybe I'll hook
this up to a backend AI at some point in the future but that'll probably only happen if I've got
loads of free time.

The code itself is a bit of a mess but it is just for fun after all. The main board-representing
data structure is currently a one dimensional array. This was partially because I'd been thinking
about bitboards and maybe using a Uint8Array(8) or similar to store the wall state (although the
grid is 9x9 you only need 2x64 bits for the walls), and partially because it was a quick and dirty
way of getting the UI going with absolute positioning and no CSS grid or anything. I should probably
refactor this.
Implementing the rules was actually rather fun and slightly tricker than I initially expected.

I've been told the UI is not super beautiful but a) UI design is not my strong point,
b) I didn't spend any time on it and c) I have a soft spot for brutalism. Maybe I'll make it look
pretty next time I have to brush up on CSS.

The game itself is (semi-temporarily) hosted [here](http://angularcorridor.s3-website-eu-west-1.amazonaws.com/)
