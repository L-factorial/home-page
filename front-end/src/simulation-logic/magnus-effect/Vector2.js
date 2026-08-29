export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
export const scale = (vector, scalar) => ({ x: vector.x * scalar, y: vector.y * scalar });
export const magnitude = (vector) => Math.hypot(vector.x, vector.y);

export const normalize = (vector) => {
  const length = magnitude(vector);
  return length < 1e-9 ? { x: 0, y: 0 } : scale(vector, 1 / length);
};

export const leftPerpendicular = (vector) => ({ x: -vector.y, y: vector.x });
