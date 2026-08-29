const makeArticle = (id, title, category, body, publishedAt = '2026-08-29') => ({
  id: String(id),
  title,
  category,
  publishedAt,
  updatedAt: publishedAt,
  body,
});

export const articles = [
  makeArticle('101', 'Welcome to the static blog', 'Technical', `# Welcome

This is placeholder content served directly by the React application. No backend request is required.

Replace this article in \`src/data/dummyContent.js\` when the real content source is ready.`),
  makeArticle('102', 'Notes on creative programming', 'Technical', `# Creative programming

Creative programming combines algorithms, mathematics, and visual experimentation. This site includes collision simulations, an eight-puzzle solver, and convex-hull code.`),
  makeArticle('201', 'A small personal update', 'Personal', `# A personal note

This is sample personal-blog content. It demonstrates category navigation and client-side article routing.`),
];

export const pageContent = {
  about: `# About me

I write code for a living, and also for my own creative imagination. The wheel, electricity, airplanes, microprocessors, the internet, and now LLMs are some of mankind’s finest inventions. I also happen to believe the humble HashMap belongs somewhere on that list.

[Sir Viv Richards](https://en.wikipedia.org/wiki/Viv_Richards) is the greatest player to ever play the game of cricket. This is not an opinion. We can debate almost anything else.

I love people, stories, arguments, ideas, and good company. Knock on my door anytime — happy to be your unofficial therapist over a chilled beer, strong coffee, or a good cup of tea. Your choice. And we’ll have a factorially good time.`,
  kathmanduUniversity: `# Kathmandu University

This is placeholder content about Kathmandu University.`,
};

export const simulationDescriptions = {
  6: '# Family collision demo\n\nA playful particle simulation using family images.',
  7: '# Pollen grain\n\nA particle model inspired by Brownian motion.',
  8: '# Eight puzzle\n\nAn interactive demonstration of A* search.',
  9: '# Collision and convex hull\n\nParticles combined with a two-dimensional convex-hull calculation.',
  10: '# Elastic collision\n\nA local event-driven particle collision simulation.',
  11: '# Diffusion\n\nA visual demonstration of particles diffusing through an opening.',
  12: '# Snooker board\n\nElastic collisions arranged as a snooker-table demonstration.',
};

export const blogCategories = [...new Set(articles.map(({ category }) => category))];

export const getArticlesByCategory = (category) =>
  articles.filter((article) => article.category === category);

export const getArticleById = (id) =>
  articles.find((article) => article.id === String(id));
