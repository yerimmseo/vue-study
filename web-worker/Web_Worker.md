Javascript는 Single Thread로 동작함. 하지만 브라우저는 Single Thread로 동작하지 않음

##### Web Worker란

MDN에서 다음과 같이 정의되어 있음.

Web Worker는 script 실행을 메인 스레드가 아니라 백그라운드 스레드에서 실행할 수 있도록 해주는 기술임. 이 기술을 통해 무거운 작업을 분리된 스레드에서 처리할 수 있으며, 이를 통해 메인 스레드(일반적으로  UI 스레드)는 멈춤, 속도 저하 없이 동작할 수 있게 됨.

----

<i>* workers 패키지를 따로 만들어서 worker들을 분류함</i>

![image](https://user-images.githubusercontent.com/80576569/165871274-65e10276-6aa9-47de-bb52-f5445a48ac63.png)

<i>`new` 라는 연산자를 사용하여 Worker를 생성해주고, 파라미터로 worker가 있는 스크립트 경로를 넣어줌</i>

![image](https://user-images.githubusercontent.com/80576569/165871309-f76a5532-5cb4-4896-a11a-06440bb6132d.png)

<i>이제 서로가 message를 주고 받을 수 있게 됨</i>

<i>메세지를 받기 위해서는 `onmessage`를 사용하고, 메세지를 보내기 위해서는 `postMessage`를 사용함</i>

<i>메세지는 `event`객체에 `data`에 존재함</i>

##### <i>∗ 중요한 점</i>

<i>이 `data`는 공유되는 것이 아닌 `복제를 통해` 전달할 수 있음.</i>

![image](https://user-images.githubusercontent.com/80576569/165871331-48ac2b90-b537-4155-8cac-2ae7ec942c42.png)

<i>메인 스레드에서 worker에게 작업을 부여(postMessage)하면 worker는 주어진 일(onmessage)을 처리하는 대로 다시 메인 스레드에게 보내줌(postMessage)</i>

<i>워커가 보내온 작업 완료 메세지를 확인(onmessage)한 메인 스레드는 화면에서 랜더링 해줌</i>

<i>countWorker를 보면</i>

![image](https://user-images.githubusercontent.com/80576569/165871343-0618dae4-e949-4020-8b77-f4e808c594de.png)

<i>`self`를 `console.log`에서 살펴보면 다음과 같이 출력됨</i>

![image](https://user-images.githubusercontent.com/80576569/165871354-41628112-9a97-4e6b-af7a-4254ef6ce72d.png)

<i>이것은 메인 스레드에서 호출된 worker를 의미하며, 단일 스크립트로서 사용된다는 것을 의미함. 메인 스레드하고만 메시지를 주고 받을 수 있음</i>

<i>그래서 `window` 객체를 `console.log`에 찍어보면 worker의 scope 영역에서는 `window` 객체가 정의되어 있지 않다는 결과를 볼 수 있음</i>

![image](https://user-images.githubusercontent.com/80576569/165871369-567c1dc5-9a9c-4262-866a-765313495eef.png)

<i>[참고] : https://velog.io/@kimu2370/Web-Worker</i>

<i>https://program-garage.tistory.com/25?category=421402</i>

-----

##### Web Worker를 사용하지 않는 이유

- 첫 번쨰로, 서버에서 대부분의 데이터를 처리하기 때문에 굳이 Web Worker를 사용하게 될 일이 없음(Web Worker를 사용할 만큼 부하가 걸리는 작업을 안 함).
- 두 번째로, Dom 제어 및 Window 객체의 일부 함수가 메인 스레드에서만 가능하고 Web Worker에서는 사용이 불가능한 부분이 있음.
- 세 번째로는, 단순 계산식에서는 Web Worker를 사용하지 않는 것이 더 빠르기도 하고, 메인 스레드와 Web Worker 간 데이터 전송 시에는 비용이 발생하기 때문임.

##### Web Worker를 사용하는 경우

- 첫 번째로, 화면 동작에 영향을 미치는 연산 동작, 즉, 바이너리 파일 핸들링이나 복잡한 계산이 필요한 경우에 유용함.
- 두 번째로, 백그라운드에서 지속적인 작업을 해야 하거나 메인 스레드 영향을 미치지 않고 작업을 하는 경우에 유용하게 사용될 수 있음.
- 세 번째로는, 멀티 스레드로 개발했을 때 사용자 환경 개선에 도움이 되는 경우로 볼 수 있음. 싱글 페이지 애플리케이션으로 개발되는 프로젝트라면 사용했을 때 도움이 되는 부분이 있을 것으로 생각됨.

https://tech.kakao.com/2021/09/02/web-worker/

