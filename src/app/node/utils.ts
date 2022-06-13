export interface IData {
  initial: number[],
  random: number[],
  reversed: number[]
}


export interface IOperation {
  name: string,
  fn: (x: number) => any,
  isFaster: number,
  averageTime: number,
  results: number[],
  class?: string
}

export enum ArrayType {
  initial,
  reversed,
  random
}


export interface IResultItem {
  operation1: IOperation,
  operation2: IOperation,
  isEqual: number,
  Failes?: number,
}

export interface IResult {
  label?: string,
  length: number,
  value: IResultItem
}

export interface IServerResult {
  label: string,
  data: IResult
}

export const arrLength = 1000;
export const iterationsCount = 8000;
export const experiments = 5;

// generate --------------------------------------------------------

export const genArraySize = 10000;
export function genArray(count = genArraySize): number[] {
  const arr: number[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(i);
  }

  return arr;
}

export function genRandomArray(count = genArraySize): number[] {
  return shuffleArray(genArray(count));
}

export function genReversedArray(count = genArraySize): number[] {
  return genArray(count).reverse();
}

const shuffleArray = (array: number[]): number[] => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}



export const genSampleIndexes = (dataLength: number, maxSamplesLength = 20): number[] => {
  const arr = [];
  if (!dataLength) {
    return arr;
  }

  let length = dataLength;
  if (dataLength > maxSamplesLength) {
    length = maxSamplesLength;
  }

  let offset = Math.floor(dataLength / length);

  for (let i = offset; i <= dataLength; i = i + offset) {
    arr.push(i);
  }

  return arr;
}

const swap = <T>(arr: T[], a: number, b: number): void => {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

export enum Compare {
  LESS_THAN = -1,
  BIGGER_THAN = 1
};

export const defaultCompare = (a: number, b: number): number => {
  if (a === b) {
    return 0;
  }

  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

export const selectionSort = (arr: number[], compare = defaultCompare): number[] => {
  const { length } = arr;
  let minIndex;
  for (let i = 0; i < length - 1; i++) {
    minIndex = i;
    for (let j = i; j < length; j++) {
      if (compare(arr[minIndex], arr[j]) === Compare.BIGGER_THAN) {
        minIndex = j;
      }
    }
    if (i !== minIndex) {
      swap(arr, i, minIndex);
    }
  }
  return arr;
}

export const insertionSort = (array: number[], compare = defaultCompare): number[] => {
  const length = array.length;
  let temp: number;

  for (let i = 1; i < length; i++) {
    let j = i;
    temp = array[i];
    while (j > 0 && compare(array[j - 1], temp) === Compare.BIGGER_THAN) {
      array[j] = array[j - 1];
      j--;
    }
    array[j] = temp;
  }

  return array;
}

const mergeSort = (arr: number[], compare = defaultCompare): number[] => {
  if (arr.length > 1) {
    const { length } = arr;
    const middle = Math.floor(length / 2);
    const left = mergeSort(arr.slice(0, middle), compare);
    const right = mergeSort(arr.slice(middle, length), compare);
    arr = merge(left, right, compare);
  }
  return arr;
}

const merge = (left: number[], right: number[], compare): number[] => {
  let i = 0;
  let j = 0;
  const result = [];
  while (i < left.length && j < right.length) {
    result.push(compare(left[i], right[j]) === Compare.LESS_THAN ? left[i++] : right[j++]);
  }
  return result.concat(i < left.length ? left.slice(i) : right.slice(j));
}

export const quickSort = (array: number[], compare = defaultCompare): number[] => {
  return quick(array, 0, array.length - 1, compare);
}

export const quick = (arr: number[], left: number, right: number, compare: (a: number, b: number) => number): number[] => {
  let i: number;
  if (arr.length > 1) {
    i = partition(arr, left, right, compare);
    if (left < i - 1) {
      quick(arr, left, i - 1, compare);
    }
    if (i < right) {
      quick(arr, i, right, compare);
    }
  }

  return arr;
}


export const partition = (arr: number[], left: number, right: number, compare): number => {
  const pivot = arr[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;
  while (i <= j) {
    while (compare(arr[i], pivot) === Compare.LESS_THAN) {
      i++;
    }
    while (compare(arr[j], pivot) === Compare.BIGGER_THAN) {
      j--;
    }
    if (i <= j) {
      swap(arr, i, j);
      i++;
      j--;
    }
  }
  return i;
}



export const runExperiment = async (length: number, array: number[], experimentsCount = experiments, calcFn = calcTime)
  : Promise<IResult> => {
  const fn1: any = {
    name: 'Array.prototype.sort',
    fn: (arr: number[]) => arr.sort((a, b) => a - b),
    results: [],
    averageTime: 0,
    isFaster: 0
  };

  const fn2: any = {
    name: 'quick Sort',
    fn: (arr: number[]) => quickSort(arr),
    results: [],
    averageTime: 0,
    isFaster: 0
  };

  const value = await compare(fn1, fn2, experimentsCount, calcFn, array);

  return Promise.resolve({
    value,
    length: length
  });
}

export const compare = async (operation1: IOperation, operation2: IOperation, count: number = experiments, calcFn: Function, array: number[]):
  Promise<IResultItem> => {
  const result: IResultItem = {
    operation1,
    operation2,
    isEqual: 0,
    Failes: 0
  };
  result.operation1.isFaster = result.operation2.isFaster = 0;

  for (let i = 0; i < count; i++) {
    const res1 = calcFn.call(null, operation1.fn, array);
    await new Promise(resolve => setTimeout(resolve, 1));
    const res2 = calcFn.call(null, operation2.fn, array);
    if (!i) {
      result.operation1.averageTime = res1;
      result.operation2.averageTime = res2;
    } else {
      result.operation1.averageTime = (result.operation1.averageTime + res1) / 2;
      result.operation2.averageTime = (result.operation2.averageTime + res2) / 2;
    }
    result.operation1.class = result.operation2.class = '';
    result.operation1.results.push(res1);
    result.operation2.results.push(res2);

    if (res1 && res2) {
      if (res1 < res2)
        result.operation1.isFaster++
      else if (res1 > res2)
        result.operation2.isFaster++;
      else
        result.isEqual++;

      continue;
    }
    else result.Failes++;

  }
  return result;
}



export const calcTime = (fn: Function, array: number[]): number => {
  const time = 25;
  let fnCnt = 0;
  let otherOperationsCnt = 0;
  let startTime = (new Date()).getTime();

  while ((new Date()).getTime() - startTime < time) {
    fn.call(null, [...array]);
    ++fnCnt;
  }

  startTime = (new Date()).getTime();

  while ((new Date()).getTime() - startTime < time) {
    const arr = [...array];
    ++otherOperationsCnt;
  }

  return time / fnCnt - time / otherOperationsCnt;
}


export const calcTimeByPerformance = (fn: Function, array: number[], iterations = iterationsCount,): number => {

  performance.mark('a');
  for (let i = 0; i < iterations; i++) {
    const arr = [...array];
    fn.call(null, arr);
  };
  performance.mark('b');
  for (let i = 0; i < iterations; i++) {
    const arr = [...array];
  };
  performance.mark('c');
  performance.measure("ab", 'a', 'b');
  performance.measure("bc", 'b', 'c');
  const value = performance.getEntriesByName("ab", "measure")[0]?.duration;
  const cycle = performance.getEntriesByName("bc", "measure")[0]?.duration;

  performance.clearMarks();
  performance.clearMeasures();
  const diff = ((value as number) - (cycle as number)) / iterations;
  return diff;
}