import { genArray, genSampleIndexes, calcTime, IResultItem, runExperiment, arrLength, experiments, genRandomArray, genReversedArray, IData } from './utils';
import { performance, } from 'perf_hooks';
const fs = require('fs');
const arraySize = arrLength;
const mockfilePath = 'src/assets/data.json';
const resultfilePath = 'src/assets/result.json';
import * as mock from '../../assets/data.json';
import * as sorted from '../../assets/result.json';

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

  const initialSorted = { label: "initial", data: [] };;
  for (let i of sampleIndexes) {
    const result = await runExperiment(i, initial, experimentsCount, calcTime);
    initialSorted.data.push(result)
  }

  const randomSorted = { label: "random", data: [] };
  for (let i of sampleIndexes) {
    const result = await runExperiment(i, random, experimentsCount, calcTime);
    randomSorted.data.push(result)
  }

  const reverseSorted = { label: "reversed", data: [] };
  for (let i of sampleIndexes) {
    const result = await runExperiment(i, reversed, experimentsCount, calcTime);
    reverseSorted.data.push(result)
  }


  const result = JSON.stringify([...sorted, reverseSorted]);
  fs.writeFileSync(resultfilePath, result, (err) => {
    if (err) throw err;
  });
}

run();

//generate();

