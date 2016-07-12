
function* test2() {
  yield 4;
  yield 5;
}

function* test() {
  try {
    yield 1;
    yield* test2();
    yield 2;
    yield 3;
  } finally {
    console.log('finished');
  }
}

for (const value of test()) {
  console.log(value);
}