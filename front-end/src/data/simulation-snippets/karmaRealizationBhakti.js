export default String.raw`# Karma → Realization → Bhakti

The animation models one natural event: the sound and motion of a struck vibrating body. A bell, string, or membrane begins with many normal modes, loses its higher modes through damping, and eventually returns to equilibrium.

## Karma: superposition

Immediately after excitation, several frequencies coexist:

    y(t) = Σ Aₖ sin(ωₖt + φₖ)

The displayed trajectory is the sum of five deterministic harmonics. Their interference produces complex motion even though every individual mode is simple. The small spectrum shows the amplitude of each component.

## Realization: frequency-dependent damping

One parameter λ describes dissipation. Higher modes decay more quickly than the fundamental:

    Aₖ(λ) = Aₖ(0)(1 − λ)^qₖ

The exponents qₖ increase for higher modes. As λ moves from zero to one, the spectrum visibly changes from five peaks to one. The trajectory becomes smooth because its high-frequency content has physically disappeared—not because a visual smoothing filter was applied.

The energy fraction of each mode is:

    pₖ = Aₖ² / Σ Aⱼ²

and the normalized spectral entropy displayed in the animation is:

    Hₛ = −Σ pₖ log(pₖ) / log(N)

Karma has distributed spectral energy and high Hₛ. During Realization, Hₛ falls until only the fundamental remains.

## Bhakti: equilibrium in phase space

The remaining mode follows the damped harmonic-oscillator equation:

    d²y/dt² + 2γ dy/dt + ω²y = 0

Its state is not only position y, but the pair (y, dy/dt). For an underdamped oscillator, this state follows a spiral:

    r(t) = r₀e^(−γt)
    θ(t) = θ₀ + ωt

The spiral therefore represents the phase portrait of the same vibration. Its radius approaches zero as both displacement and velocity approach equilibrium:

    (y, dy/dt) → (0, 0)

The complete progression is one physical and mathematical story:

    superposition → dissipation → equilibrium

or, more poetically:

    many voices → one tone → silence`;

