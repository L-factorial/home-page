const snippetLoaders = {
  18: () => import('./simulation-snippets/karmaRealizationBhakti'),
  6: () => import('./simulation-snippets/elasticConfiguration'),
  7: () => import('./simulation-snippets/elasticConfiguration'),
  8: () => import('./simulation-snippets/eightPuzzle'),
  9: () => import('./simulation-snippets/convexHull'),
  10: () => import('./simulation-snippets/elasticCollision'),
  11: () => import('./simulation-snippets/elasticConfiguration'),
  12: () => import('./simulation-snippets/elasticConfiguration'),
  13: () => import('./simulation-snippets/fourierNepal'),
  14: () => import('./simulation-snippets/magnusEffect'),
  15: () => import('./simulation-snippets/kitty'),
  16: () => import('./simulation-snippets/usaVoronoi'),
  17: () => import('./simulation-snippets/fourierAudio'),
};

// This is the boundary between the UI and its content source. To use a backend
// later, replace the dynamic import with fetch(`/api/simulations/${id}/snippet`).
export const getSimulationSnippet = async (id) => {
  const loadSnippet = snippetLoaders[id];
  if (!loadSnippet) throw new Error(`No code snippet configured for simulation ${id}`);
  const module = await loadSnippet();
  return module.default;
};
