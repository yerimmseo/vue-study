new Vue({
  el: '#app',
  data: {
    dataArray: [],
    listOK: false,
    readOK: false,
    writeOK: false,
    boardInfo: {}
  },
  components: {
    'my-board-list': MyBoardList,
    'my-board-read': MyBoardRead,
    'my-board-write': MyBoardWrite
  },
  methods: {
    loadData: function(e) {
      file = e.target.files[0];
      if (file) {
        var reader = new FileReader();
        var vm = this;
        reader.readAsText(file);
        reader.onload = function(e) {
          vm.dataArray = JSON.parse(e.target.result);
        };
        reader.onloadend = function(e) {
          if (vm.dataArray != null && vm.dataArray['board'].length > 0) {
            vm.listOK = true;
          }
          else vm.listOK = false;
        }
      }
    },
    boardRead: function (info) {
      this.listOK = false;
      this.readOK = true;
      this.boardInfo = info;
      // 해당 글을 찾아서 카운트를 올려줌
      for (var i = 0; i < this.dataArray['board'].length; i++) {
        if (this.dataArray['board'][i].no == info.no)
          this.dataArray['board'][i].view = parseInt(this.dataArray['board'][i].view) + 1;
      }
    },
    boardList: function () {
      this.readOK = false;
      this.writeOK = false;
      this.listOK = true;
    },
    boardWrite: function () {
      this.listOK = false;
      this.readOK = false;
      this.writeOK = true;
    },
    boardSave: function (title, content) {
      var no = 1;
      if (this.dataArray['board'].length != 0)
        no = parseInt(this.dataArray['board'][this.dataArray['board'].length - 1].no) + 1;
      var board_info = {
        no: no,
        title: title,
        content: content,
        view: "1"
      };

      this.dataArray['board'].push(board_info);
      this.writeOK = false;
      this.readOK = false;
      this.listOK = true;
    },
    boardDelete: function (no) {
      // 해당 글을 찾아서 삭제
      for (var i = 0; i < this.dataArray['board'].length; i++) {
        if (this.dataArray['board'][i].no == no)
          this.dataArray['board'].splice(i, 1);
      }
    },
    saveBoardList: function () {
      var data = this.dataArray;

      if (data.length == 0) {
        alert('저장할 게시판 내용이 없습니다.');
        return;
      }
      var filename = 'board.json';
      if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4);
      }

      var blob = new Blob([data], {type: 'text/json'})
      var e = document.createEvent('MouseEvent');
      var a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    }
  }
});
