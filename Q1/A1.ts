function permutations(arr: number[]): number[][] {
  const result: number[][] = [];
  const used: boolean[] = new Array(arr.length).fill(false);
  const path: number[] = [];

  function dfs() {
    if (path.length === arr.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue;

      used[i] = true;
      path.push(arr[i]);
      dfs();
      path.pop();
      used[i] = false;
    }
  }

  dfs();
  return result;
}

function solve(input: number[]): { a: string; b: string } {
  let bestA: string = '0';
  let bestB: string = '0';
  let bestMultiple = -1n;

  for (const p of permutations(input)) {
    for (let cut = 1; cut < p.length; cut++) {
      const a = p.slice(0, cut).join('');
      const b = p.slice(cut).join('');
      const multiple = BigInt(a) * BigInt(b);
      if (multiple > bestMultiple) {
        bestMultiple = multiple;
        bestA = a;
        bestB = b;
      }
    }
  }

  return { a: bestA, b: bestB };
}

const { a, b } = solve([1, 3, 5, 7, 9]);

console.log(`result: ${a}, ${b}`);
