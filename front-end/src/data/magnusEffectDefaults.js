const magnusEffectDefaults = {
  ballRadius: 0.11,
  ballMass: 0.43,
  airDensity: 1.225,
  dragCoefficient: 0.25,
  magnusCoefficientScale: 1.15,
  maximumMagnusCoefficient: 0.38,
  magnusStrength: 0.38,
  gravity: 9.81,
  fixedTimeStep: 1 / 120,
  initialSpeed: 25,
  initialSpin: 5,
  worldBounds: { left: -50, right: 50, bottom: -28, top: 28 },
};

export default magnusEffectDefaults;
