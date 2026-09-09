import FourierAudioEngine from './FourierAudioEngine';

function setup(resume) {
  const engine = new FourierAudioEngine();
  const source = { stop: jest.fn(), disconnect: jest.fn() };
  const gain = { disconnect: jest.fn() };
  engine.buffer = { duration: 10 };
  engine.context = { state: 'suspended', currentTime: 0, resume };
  engine.createSource = jest.fn(() => ({ source, gain }));
  return { engine, source, gain };
}

test('starts audio during the tap and waits for resume before reporting playback', async () => {
  let finishResume;
  const { engine } = setup(jest.fn(() => new Promise(resolve => { finishResume = resolve; })));
  const playback = engine.play();
  expect(engine.context.resume).toHaveBeenCalledTimes(1);
  expect(engine.createSource).toHaveBeenCalledTimes(1);
  expect(engine.playing).toBe(false);
  await engine.play();
  expect(engine.createSource).toHaveBeenCalledTimes(1);
  engine.context.state = 'running';
  finishResume();
  await playback;
  expect(engine.playing).toBe(true);
});

test('cleans up blocked playback and allows another tap to retry', async () => {
  const { engine, source, gain } = setup(jest.fn().mockRejectedValueOnce(new Error('Blocked')));
  await expect(engine.play()).rejects.toThrow('Blocked');
  expect(source.stop).toHaveBeenCalledTimes(1);
  expect(gain.disconnect).toHaveBeenCalledTimes(1);
  expect(engine.playing).toBe(false);
  engine.context.resume.mockImplementation(() => {
    engine.context.state = 'running';
    return Promise.resolve();
  });
  await engine.play();
  expect(engine.playing).toBe(true);
});

test('reports a stalled browser resume instead of waiting forever', async () => {
  jest.useFakeTimers();
  try {
    const { engine, source } = setup(() => new Promise(() => {}));
    const result = expect(engine.play()).rejects.toThrow('Tap Play to try again');
    jest.advanceTimersByTime(5000);
    await result;
    expect(source.stop).toHaveBeenCalledTimes(1);
    expect(engine.starting).toBe(false);
    expect(engine.playing).toBe(false);
  } finally {
    jest.useRealTimers();
  }
});

test('does not report playback if the context remains interrupted', async () => {
  const { engine } = setup(() => Promise.resolve());
  engine.context.state = 'interrupted';
  await expect(engine.play()).rejects.toThrow('Audio was interrupted');
  expect(engine.playing).toBe(false);
});

test('does not resume playback after leaving the page during startup', async () => {
  let finishResume;
  const { engine } = setup(() => new Promise(resolve => { finishResume = resolve; }));
  engine.context.close = jest.fn().mockResolvedValue();
  const playback = engine.play();
  await engine.dispose();
  finishResume();
  await playback;
  expect(engine.playing).toBe(false);
  expect(engine.source).toBe(null);
});
