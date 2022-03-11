// MyboardList 컴포넌트 작성
var MyBoardList = {
  props: ["object"],
  template: `
  <div>
    <table id="list">
      <tr>
        <th style="width:50px">글번호</th>
        <th>글제목</th>
        <th style="width:50px">조회수</th>
        <th style="width:70px"></th>
      </tr>
      <tr v-for="item in object" v-bind:key="item.no">
        <td>{{ item.no }}</td>
        <td v-on:click="boardRead(item)">{{ item.title }}</td>
        <td>{{ item.title }}</td>
        <td><button v-on:click="boardDelete(item.no)">삭제</button></td>
      </tr>
    </table>
    <button v-on:click="boardWrite" style="float: right;">글쓰기</button>
  </div>
  `,
  methods: {
    // 컴포넌트 안에서 버튼을 클릭하면 해당 이벤트를 발생시켜야 하는데 이를 상위 컴포넌트로 전달하기 위해 this.$emit()을 사용
    // v-on:board-read="boardRead"로 넣으면 컴포넌트의 methods 안에 정의된 this.$emit('board-read')가 상위 컴포넌트의 boardRead를 실행시킴
    // this.$emit('이벤트명', 매개변수)
    boardRead: function (info) {
      this.$emit('board-read', info);
    },
    boardWrite: function () {
      this.$emit('board-write');
    },
    boardDelete: function (no) {
      this.$emit('board-delete', no);
    }
  }
};

var MyBoardRead = {
  props: ["object"],
  template: `
  <div>
    <table id="list">
      <tr>
        <td style="width:50px">글제목</td>
        <td>{{ object.title }}</td>
      </tr>
      <tr style="height:300px">
        <td colspan="2">{{ object.content }}</td>
      </tr>
    </table>
    <button v-on:click="boardList" style="float: right;">목록</button>
  </div>
  `,
  methods: {
    boardList: function () {
      this.$emit('board-list');
    }
  }
};

var MyBoardWrite = {
  template: `
  <div>
    <table id="list">
      <tr>
        <td>글제목</td>
        <td><input type="text" v-model="title" style="width:90%"></td>
      </tr>
      <tr>
        <td colspan="2"><textarea v-model="content" style="width:100%"></textarea></td>
      </tr>
    </table>
    <button v-on:click="boardList" style="float: right;">목록</button>
    <button v-on:click="boardSave" style="float: right;">저장</button>
  </div>
  `,
  methods: {
    boardList: function () {
      this.$emit('board-list');
    },
    boardSave: function () {
      this.$emit('board-save', this.title, this.content);
    }
  },
  data: function () {
    return {
      title: "",
      content: ""
    }
  }
}