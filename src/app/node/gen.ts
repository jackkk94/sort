import { genArray, genSampleIndexes, calcTime, IResultItem, runExperiment, arrLength, experiments, genRandomArray, genReversedArray, IData, calcTimeCustom, iterationsCount } from './utils';
import { performance, } from 'perf_hooks';
const fs = require('fs');
const arraySize = arrLength;
const mockfilePath = 'src/assets/data.json';
const resultfilePath = 'src/assets/result.json';
import * as mock from '../../assets/data.json';
import * as sorted from '../../assets/result.json';

function calcTimeNode  (fn: Function, array: number[],iterations = 100): number  {
  const start = process.hrtime()[0] * 1000 + process.hrtime()[1] / 1000000;
  for (let i = 0; i < iterations; i++) {
    const arr = [...array];
    fn.call(null, arr);
  };
  const end = process.hrtime()[0] * 1000 + process.hrtime()[1] / 1000000;
  for (let i = 0; i < iterations; i++) {
    const arr = [...array];
   };
  const endCycle = process.hrtime()[0] * 1000 + process.hrtime()[1] / 1000000;
  const diff = (end - start - (endCycle - end)) / iterations;
  return diff;
}

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

async function run(size = arraySize, experimentsCount = experiments) {
  const initial = mock.initial.slice(0, size);
  const random = mock.random.slice(0, size);
  const reversed = mock.reversed.slice(0, size);
  const sampleIndexes = genSampleIndexes(size);

  // const initialSorted = { label: "initial", data: [] };;
  // for (let i of sampleIndexes) {
  //   const result = await runExperiment(i, initial, experimentsCount, calcTimeCustom);
  //   initialSorted.data.push(result)
  // }

  const randomSorted = { label: "random", data: [] };
  for (let i of sampleIndexes) {
    const result = await runExperiment(i, random, experimentsCount, calcTimeNode);
    randomSorted.data.push(result)
  }

  // const reverseSorted = { label: "reversed", data: [] };
  // for (let i of sampleIndexes) {
  //   const result = await runExperiment(i, reversed, experimentsCount, calcTimeCustom);
  //   reverseSorted.data.push(result)
  // }


  const result = JSON.stringify([...sorted, randomSorted]);
  fs.writeFileSync(resultfilePath, result, (err) => {
    if (err) throw err;
  });
}

run();

//generate();

