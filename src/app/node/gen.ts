import { genArray, genSampleIndexes, iterationsCount, IResult, calcTime, IOperation, IResultItem, runExperiment, calcTimeCustom, arrLength, experiments, genRandomArray, genReversedArray, IData } from './utils';
import { performance, } from 'perf_hooks';
const fs = require('fs');
const arraySize = arrLength;
const mockfilePath = 'src/assets/data.json';
const resultfilePath = 'src/assets/result.json';
const sampleIndexes = genSampleIndexes(arraySize);


function generate(): void {
  const random = genRandomArray();
  const initial = genArray();
  const reversed = genReversedArray();
  const obj = {
    initial,
    random,
    reversed
  } as IData;

  fs.writeFileSync(mockfilePath, JSON.stringify(obj), (err) => {
    if (err) throw err;

    console.log('success');
  });
}

// export const calcTimeNode = async (fn: Function, searchEl: ArrayItem, iterations: number = iterationsCount): Promise<number> => {
//   const start = process.hrtime()[0] * 1000 + process.hrtime()[1] / 1000000;
//   for (let i = 0; i < iterations; i++) {
//     fn.call(null, searchEl);
//   };
//   const end = process.hrtime()[0] * 1000 + process.hrtime()[1] / 1000000;
//   for (let i = 0; i < iterations; i++) { };
//   const endCycle = process.hrtime()[0] * 1000 + process.hrtime()[1] / 1000000;
//   const diff = (end - start - (endCycle - end)) / iterations;
//   await Promise.resolve(1);
//   return diff;
// }


async function run(size = arraySize, experimentsCount = experiments) {
  let data = JSON.parse(fs.readFileSync(mockfilePath));
  let sorted = JSON.parse(fs.readFileSync(resultfilePath));
  const initial = data.initial.slice(0, size);
  const random = data.random.slice(0, size);
  const reversed = data.reversed.slice(0, size);
  const sampleIndexes = genSampleIndexes(size);

  const initialSorted = { label: "initial", data: [] };;
  // for (let i of sampleIndexes) {
  //   const result = await runExperiment(i, initial, experimentsCount, calcTime);
  //   initialSorted.data.push(result)
  // }

  const randomSorted = { label: "random", data: [] };
  // for (let i of sampleIndexes) {
  //   const result = await runExperiment(i, random, experimentsCount, calcTime);
  //   randomSorted.data.push(result)
  // }

  const reverseSorted = { label: "reversed", data: [] };
  for (let i of sampleIndexes) {
    const result = await runExperiment(i, reversed, experimentsCount, calcTime);
    reverseSorted.data.push(result)
  }


  const result = JSON.stringify([...sorted, initialSorted]);
  fs.writeFileSync(resultfilePath, result, (err) => {
    if (err) throw err;
  });
}

run();

//generate();

