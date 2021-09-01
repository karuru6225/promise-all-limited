import PromiseAllLimited, {
  RunningStatus,
  PromiseOptions
} from '../index';


test('Promiseの数と返ってきた結果の数が同じ', async () => {
  const length = 12;
  const promises = [...Array(length)].map((_) => () => Promise.resolve());

  const results = await PromiseAllLimited(promises);

  expect(results).toHaveLength(length);
});

test('指定した数で並列実行している', async () => {
  const startTime = Date.now();
  const limit = 3;
  const length = limit * 3;
  const delayTime = 100;
  const promises = [...Array(length)].map(
    () => () => new Promise<number>(r => {
      const taskTime = Date.now() - startTime;
      setTimeout(() => r(taskTime), delayTime);
    })
  );

  const results = await PromiseAllLimited(promises, { limit });

  for (let i = 0; i < length - limit; i += 1) {
    expect(results[i + limit] - results[i]).toBeGreaterThan(delayTime * 0.95);
    expect(results[i + limit] - results[i]).toBeLessThan(delayTime * 1.05);
  }
});
