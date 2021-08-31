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
