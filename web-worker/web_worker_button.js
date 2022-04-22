onmessage = function (e) {
  console.log(e.data);
  for (let i = 0; i < 1000000; i++) {
    console.log(i);
    console.log('돌고있음');
  }
  postMessage('웹 워커 끝남!');
}