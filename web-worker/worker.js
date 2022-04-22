for (let i = 0; i < 100; i++) {
  // 위 worker에서 onmessage 이벤트를 발생
  postMessage(i);
}
// test 변수는 없기 때문에 에러 발생
test.val = test + 1;