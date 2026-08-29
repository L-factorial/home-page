export default String.raw`# Eight puzzle with A* search

Each board arrangement is a search state. A priority queue chooses the state with the smallest estimated total cost: moves already made plus Manhattan distance to the goal.

    function priority(state) {
      return state.cost + state.manhattanDistanceToGoal(); // f(n) = g(n) + h(n)
    }

    frontier.offer(initialState);
    parent.set(initialState.key(), null);

    while (!frontier.empty()) {
      const current = frontier.poll();
      for (const next of current.children()) {
        if (parent.has(next.key())) continue; // Do not revisit a known board.
        parent.set(next.key(), current.key());
        if (next.isGoal()) return reconstructPath(next, parent);
        frontier.offer(next);
      }
    }

A child state is created by sliding one adjacent tile into the empty space. Manhattan distance sums how many horizontal and vertical moves every tile remains from its goal. Once found, parent links are followed backward to reconstruct the animated solution.`;
