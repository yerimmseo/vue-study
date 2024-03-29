#### 서버 인증 (세션/쿠키, JWT)

##### 인증이 필요한 이유

인증은 프론트엔드 관점 - 사용자의 로그인, 회원가입과 같이 사용자의 도입부분을 가리킴

반면, 서버사이드 관점 - 모든 API 요청에 대해 사용자를 확인하는 작업

서버에서는 누구의 요청인지를 정확히 알아야 함. 만약 그렇지 못한다면 자신의 정보가 타인에게 유출되는 최악의 상황 발생. 앱(프론트엔드)에서는 자신이 누구인지 알만한 단서를 서버에 보내야 함

##### HTTP 요청

모바일이나 웹 서비스에서 가장 많이 쓰이는 통신 방식. HTTP 통신은 응답 후 연결이 끊기게 되며 과거에 대한 정보를 전혀 담지 않음. 따라서 각 HTTP 요청에는 주체가 누구인지에 대한 정보가 필수적임

![image](https://user-images.githubusercontent.com/80576569/166210347-3efca02e-e63c-4246-8fd6-898f85c94393.png)

서버에 요청을 보내는 작업은 HTTP 메세지를 보내는 것. 일반적으로 헤더와 바디 두가지로 구성되며 공백은 헤더와 바디를 구분짓는 역할을 함.

헤더에는 기본적으로 요청에 대한 정보들이 들어감. 바디에는 서버로 보내야 할 데이터가 들어가기 됨. 

보통 모바일/웹 서비스의 인증은 HTTP 메세지의 헤더에 인증 수단을 넣어 요청을 보내게 됨

##### 인증 방식

##### 1. 계정 정보를 요청 헤더이 넣는 방식

가장 보안이 낮은 방식. 위에서 언급한 HTTP 요청에 인증할 수단을 비밀번호로 지정

(장점)

- 인증 테스트할 때 빠르게 시도해볼 수 있음

(단점)

- 보안에 매우 취약함
- 서버에서는 신호가 올 때마다 ID, PW를 통해 유저가 맞는지 인증해야 함. 이는 비효율적임

##### 2. Session/Cookie 방식

계정 정보를 매번 요청에 넣어서 보내기엔 보안이 매우 취약함. 따라서 나온 방식이 Session/Cookie 방식

![image](https://user-images.githubusercontent.com/80576569/166210385-5b50e0e0-5773-4178-b0c9-f1e7a5bb4524.png)

(순서)

1. 사용자가 로그인
2. 서버에스는 계정 정보를 읽어 사용자를 확인한 후, 사용자의 고유한 ID값을 부여하여 세션 저장소에 저장함. 이와 연결되는 세션 ID를 발행
3. 사용자는 서버에서 해당 세션 ID를 받아 쿠키에 저장한 후, 인증이 필요한 요청마다 쿠키를 헤더에 실어 보냄
4. 서버에서는 쿠키를 받아 세션 저장소에서 대조를 한 후 대응되는 정보를 가져옴
5. 인증이 완료되고 서버는 사용자에 맞는 데이터를 보내줌

세션 쿠키 방식의 인증은 기본적으로 세션 저장소를 필요로 함(Redis를 많이 사용). 세션 저장소는 로그인을 했을 때 사용자의 정보를 저장하고 열쇠가 되는 세션 ID값을 만듦. 그리고 HTTP 헤더에 실어 사용자에게 돌려보냄.

그러면 사용자는 쿠키로 보관하고 있다 인증이 필요한 요청에 쿠키(세션ID)를 넣어 보냄. 웹 서버에서는 세션 저장소에서 쿠키(세션ID)를 받고 저장되어있는 정보와 매칭시켜 인증을 완료함

<i>** 세션은 서버에서 가지고 있는 정보이며 쿠키는 사용자에게 발급된 세션을 열기 위한 열쇠(SESSION ID)를 의미함. 쿠키만으로 인증을 사용한다는 말은 서버의 자원은 사용하지 않는다는 것이며 이는 즉, 클라이언트가 인증 정보를 책임지게 됨. 그렇게 되면 위의 첫 번째 방식처럼 HTTP 요청을 탈취당할 경우 전부 털리게 됨. 따라서 보안과는 상관없는 단순한 장바구니나 자동 로그인 같은 경우에는 유용하게 쓰임</i>

결과적으로 인증의 책임을 서버가 지게 하기 위해 세션을 사용. 사용자(클라이언트)는 쿠키를 이용, 서버에서는 쿠키를 받아 세션의 정보를 접근하는 방식으로 인증

(장점)

- 세션/쿠키 방식은 기본적으로 쿠키를 매개로 인증을 거침 (쿠키는 세션 저장소에 담긴 유저 정보를 얻기 위한 열쇠). 따라서 쿠키가 담긴 HTTP 요청이 도중에 노출되더라도 쿠키 자체(세션ID)는 유의미한 값을 갖고 있지 않음(중요 정보는 세션에 있음). 이는 위의 계정 정보를 담아 인증하는 것보다 안전해 보임
- 사용자는 고유의 ID값을 발급 받게 됨. 서버에서는 쿠키 값을 받았을 때 일일이 회원 정보를 확인 할 수 없이 바로 어떤 회원인지 확인할 수 있어 서버의 자원에 접근하기 용이함

(단점)

- 쿠키를 탈취 당하더라도 안전하다고 언급했으나 해커가 사용자의 쿠키를 훔쳐 HTTP 요청을 보내면 서버의 세션 저장소에서는 다른 사용자라고 오인해 정보를 잘못 뿌려주게 됨(세션 하이재킹 공격)

  -> 해결책 : HTTPS를 사용해 요청 자체를 탈취해도 안의 정보를 읽기 힘들게 함, 세션에 유효 시간을 넣어줌

- 서버에서 세션 저장소를 사용한다고 함. 따라서 서버에서 추가적인 저장공간을 필요로 하게되고 자연스럽게 부하도 높아질 것임

##### 3. 토큰 기반 인증 방식(JWT)

JWT는 세션/쿠키와 함께 모바일과 웹의 인증을 책임지는 대표 주자임. JWT는 Json Web Token의 약자로 인증에 필요한 정보들을 암호화시킨 토큰을 뜻함. 세션/쿠키 방식과 유사하게 사용자는 Access Token(JWT 토큰)을 HTTP 헤더에 실어 서버로 보내게 됨

![image](https://user-images.githubusercontent.com/80576569/166210402-147b9ee2-f292-4c6f-b58e-3dbb9059a0de.png)

(순서)

1. 사용자가 로그인
2. 서버에서는 계정 정보를 읽어 사용자를 확인한 후, 사용자에게 고유한 ID 값을 부여한 후, 기타 정보와 함께 Payload에 넣음
3. JWT 토큰의 유효기간을 설정
4. 암호화할 SECRET KEY를 이용해 ACCESS TOKEN을 발급함
5. 사용자는 Access Token을 받아 저장한 후, 인증이 필요한 요청마다 토큰을 헤더에 실어 보냄
6. 서버에서 해당 토큰의 Verify Signature를 SECRET KEY로 복호화한 후, 조작 여부, 유효 기간을 확인함
7. 검증이 완료된다면 Payload를 디코딩하여 사용자의 ID에 맞는 데이터를 가져옴

*세션/쿠키 방식과 가장 큰 차이점*

*세션/쿠키 - 세션 저장소에 유저의 정보를 넣음*

*JWT - 토큰 안에 유저의 정보들을 넣음*

*클라이언트 입장에서는 HTTP 헤더에 세션 ID나 토큰을 실어서 보내준다는 점에서는 동일하나, 서버측에서는 인증을 위해 암호화를 하냐, 별도의 저장소를 이용하냐는 차이가 발생*

(장점)

- 간편함. JWT는 발급한 후 검증만 하면 되기 때문에 추가 저장소가 필요 없음. 이는 Stateless한 서버를 만드는 입장에서 큰 강점 (Stateless - 어떠한 별도의 저장소도 사용하지 않는, 즉 상태를 저장하지 않는 것을 의미 -> 서버를 확장하거나 유지, 보수하는데 유리)
- 확장성이 뛰어남. 토큰 기반으로 하는 다른 인증 시스템에 접근 가능함. 

(단점)

- 이미 발급된 JWT에 대해서는 돌이킬 수 없음. 세션/쿠키의 경우 악의적으로 이용된다면 해당하는 세션을 지우면됨. 하지만 JWT는 한 번 발급되면 유효기간이 완료될 때 까지는 계속 사용이 가능함. 따라서 악의적인 사용자는 유효기간이 지나기 전까지 정보를 빼갈 수 있음

  -> 해결책 : 기존의 Access Token의 유효기간을 짧게 하고, Refresh Token 이라는 새로운 토큰을 발급함. Access Token을 탈취당해도 상대적으로 피해를 줄일 수 있음

- Payload 정보가 제한적. Payload는 따로 암호화가 되지 않기 때문에 디코딩하면 누구나 정보 확인 가능 (세션/쿠키 방식에서는 유저의 정보가 전부 서버의 저장소에 안전하게 보관됨) 따라서, 유저의 중요한 정보들을 Payload에 넣을 수 없음

- JWT의 길이. 인증이 필요한 요청이 많아질수록 서버의 자원 낭비가 발생하게 됨

[참고] 서버 인증 1부 : https://tansfil.tistory.com/58?category=475681



##### 기본 JWT의 강화 버전인 Access Token & Refresh Token

##### Refresh Token?

Access Token(JWT)를 통한 인증 방식의 문제는 제 3자에게 탈취당할 경우 보안에 취약하다는 점

유효기간이 짧은 Token의 경우 그 만큼 사용자는 로그인을 자주 해서 새롭게 Token을 발급 받아야 하므로 불편함. 그러나 유효기간을 늘리자면 토큰을 탈취 당했을 때 보안에 더 취약해지게 됨 -> "Refresh Token"

Refresh Token은 Access Token과 똑같은 형태의 JWT. 처음에 로그인을 완료했을 때 Access Token과 동시에 발급되는 Refresh Token은 긴 유효기간을 가지면서, Access Token이 만료됬을 때 새로 발급해주는 열쇠가 됨(만료 : 유효기간이 지났다는 의미)

ex) Refresh Token의 유효기간 : 2주, Access Token의 유효기간 : 1시간 -> 사용자는 API 요청을 지속해서 하다가, 1시간이 지나게 되면 가지고 있는 Access Token 만료 -> Refresh Token의 유효기간 전 까지 Access  Token 새롭게 발급 가능

<i>** Access Token은 탈취당하면 정보가 유출되는 것은 동일. 다만 짧은 유효기간 안에만 사용 가능하기에 더 안전하다는 의미</i>

<i>** Refresh Token의 유효기간이 만료됐다면 사용자는 새로 로그인 진행. Refresh Token도 탈취될 가능성이 있기 때문에 적절한 유효기간 설정이 필요함(보통 2주로 많이 설정)</i>

##### Access Token + Refresh Token 인증 과정

![image](https://user-images.githubusercontent.com/80576569/166210433-d997d092-0c69-4def-841a-cefdd2c92054.png)

(순서)

1. 사용자가 로그인
2. 서버에서 회원DB에서 값을 비교(PW는 일반적으로 암호화하여 들어감)
3. ~ 4. 로그인이 완료되면 Access Token, Refresh Token을 발급함. 이때 일반적으로 회원DB에 Refresh Token을 저장해둠

5. 사용자는 Refresh Token은 안전한 저장소에 저장한 후, Access Token을 헤더에 실어 요청을 보냄
6. ~ 7. Access Token을 검증하여 이에 맞는 데이터를 보냄

8. 시간이 지나 Access Token 만료
9. 사용자는 이전과 동일하게 Access Token을 헤더에 실어 요청을 보냄
10. ~ 11. 서버는 Access Token이 만료됨을 확인하고 권한 없음을 신호로 보냄

<i>** Access Token이 만료될 때마다 과정 9 ~ 11 을 계속 거칠 필요 없음. 사용자(프론트엔드)에서 Access Token의 Payload를 통해 유효기간을 알 수 있음. 따라서 프론트엔드 단에서 API요청 전에 토큰이 만료됐다면 바로 재발급 요청을 할 수도 있음.</i>

12. 사용자는 Refresh Token과 Access Token을 함께 서버로 보냄
13. 서버는 받은 Access Token이 조작되지 않았는지 확인한 후, Refresh Token과 사용자의 DB에 저장되어 있던 Refresh Token을 비교함. Token이 동일하고 유효기간도 지나지 않았다면 새로운 Access Token을 발급해줌.
14. 서버는 새로운 Access Token을 헤더에 실어 다시 API 요청을 진행함

(장점)

- 기존의 Access Token만 있을 때보다 안전함

(단점)

- 구현이 복잡함. 검증 프로세스가 길기 때문에 구현하기가 힘들어졌음(프론트엔드, 서버 모두)
- Access Token이 만료될 때마다 새롭게 발급하는 과정에서 생기는 HTTP 요청 횟수가 많음. 이는 서버의 자원 낭비로 귀결됨

[참고] 서버 인증 2부 : https://tansfil.tistory.com/59?category=475681
