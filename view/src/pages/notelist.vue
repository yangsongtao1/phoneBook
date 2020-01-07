<template>
  <div class="layout-content-main">
    <aside class="title">
      <Breadcrumb>
        <BreadcrumbItem to="/">
          <Icon type="ios-home-outline"></Icon> {{$t('home')}}
        </BreadcrumbItem>
        <BreadcrumbItem to="/notelist">
          <Icon type="logo-buffer"></Icon> {{$t('notelist')}}
        </BreadcrumbItem>
      </Breadcrumb>
    </aside>
    <aside class="layout-content-main-content">
      <aside class="layout-content-main-content-search">
        <i-input v-model="name" :placeholder="$t('searchInput')" class="nameInput" size="large"></i-input>
        <i-button type="primary" icon="ios-add" size="large" @click="addNote">{{ $t('addnote') }}</i-button>
        <Dropdown @on-click="showInfo">
          <i-button type="primary" class="ivu-btn-large">
            {{nowShow}} {{nowTotal}}
            <Icon type="ios-arrow-down"></Icon>
          </i-button>
          <DropdownMenu slot="list">
            <DropdownItem name="all">全部 {{getAllNumber}}</DropdownItem>
            <DropdownItem divided name="work">工作 {{workNumber}}</DropdownItem>
            <DropdownItem name="study">学习 {{studyNumber}}</DropdownItem>
            <DropdownItem name="life">生活 {{lifeNumber}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </aside>
    </aside>
    <aside class="notelist">
      <Col :xs="12" :sm="12" :md="12" :lg="8" class="notelistitem" v-for="(item, index) in noteList" :key="index">
        <aside class="itemContent">
          <header class="listheader">
            <aside class="title">
              {{index + 1}}、{{item.title}}
            </aside>
            <aside class="headerTools">
              <i class="iconfont icon-edit" @click="editNote(item)"></i>
              <i class="iconfont icon-delete" @click="delModel = true"></i>
              <Modal v-model="delModel" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                  <Icon type="ios-information-circle"></Icon>
                  <span>确认删除</span>
                </p>
                <div style="text-align:center">
                  <p>确认删除（{{item.title}}）记录信息, 删除之后将永远消失</p>
                </div>
                <div slot="footer">
                  <Button type="error" size="large" long @click="deleteNote(item.id)">确认</Button>
                </div>
              </Modal>
            </aside>
          </header>
          <aside class="listInto">
            <aside class="listTime">{{item.time}}</aside>
            <aside class="listType">
              分类:
              <span v-if="item.type === 'work'">工作</span>
              <span v-if="item.type === 'life'">生活</span>
              <span v-if="item.type === 'study'">学习</span>
            </aside>
          </aside>
          <aside class="listContent" v-html="item.content">
          </aside>
        </aside>
      </Col>
    </aside>
    <add-note v-if="showAddNote" @closeAddNote="closeAddNote" @saveNote="saveNote" :NoteData="editData" @updateNote="updateNote"/>
  </div>
</template>

<script>
import axios from '../axios'
import addNote from '../components/addNote'
import dateFormat from '../assets/js/Date'
export default {
  name: 'notelist',
  data () {
    return {
      workNumber: 0,
      lifeNumber: 0,
      studyNumber: 0,
      workNumber1: 0,
      lifeNumber1: 0,
      studyNumber1: 0,
      nowShow: '全部',
      nowTotal: 0,
      showAddNote: false,
      delModel: false,
      name: '',
      type: '工作',
      content: '',
      noteList: [],
      editData: {}
    }
  },
  created () {
    this.getNoteNumberByType()
    this.getNoteList()
  },
  methods: {
    refreshNoteList () {
      if (this.nowShow === '全部') {
        this.getNoteNumberByType()
        this.getNoteList()
      } else if (this.nowShow === '工作') {
        this.getNoteNumberByType()
        this.showInfo('work')
      } else if (this.nowShow === '生活') {
        this.showInfo('life')
        this.getNoteNumberByType()
      } else if (this.nowShow === '学习') {
        this.getNoteNumberByType()
        this.showInfo('study')
      }
    },
    showInfo (name) {
      this.getNoteListByType(name)
      if (name === 'all') {
        this.nowShow = '全部'
        this.getNoteList()
      } else if (name === 'work') {
        this.nowShow = '工作'
      } else if (name === 'study') {
        this.nowShow = '学习'
      } else if (name === 'life') {
        this.nowShow = '生活'
      }
    },
    getNoteListByType (type) {
      let typeInfo = {
        type: type
      }
      axios.post('/api/getNoteListByType', typeInfo).then(({status, data}) => {
        if (status === 200) {
          if (data.code === 100) {
            this.nowTotal = data.length
            this.noteList = []
            this.noteList = data.lists
          }
        }
      })
    },
    getNoteNumberByType () {
      let i
      axios.get('/api/getNoteNumberByType').then(({status, data}) => {
        if (status === 200){
          if (data.code === 100) {
            for(i = 0; i < data.data.length; i++) {
              if (data.data[i]['类型'] === 'study') {
                this.studyNumber1 = data.data[i]['人数']
              } else if (data.data[i]['类型'] === 'work') {
                this.workNumber1 = data.data[i]['人数']
              } else if (data.data[i]['类型'] === 'life') {
                this.lifeNumber1 = data.data[i]['人数']
              }
              this.nowTotal = this.workNumber1 + this.lifeNumber1 + this.studyNumber1
            }
          }
        }
      })
    },
    getNoteList () {
      axios.get('/api/getNoteList', {params: {uid: this.$store.state.users.id}}).then(({status, data}) => {
        if (status === 200) {
          if (data.code === 100) {
            this.noteList = []
            this.noteList = data.lists
            this.nowTotal = this.noteList.length
          }
        }
      })
    },
    getNoteListByName () {
      let type
      if (this.nowShow === '全部') {
        type = 'all'
      } else if (this.nowShow === '工作') {
        type = 'work'
      } else if (this.nowShow === '学习') {
        type = 'study'
      } else if (this.nowShow === '生活') {
        type = 'life'
      }
      let info = {
        type: type,
        name: this.name
      }
      axios.post('/api/getNoteListByName', info).then(({status, data}) => {
        if (status === 200) {
          if (data.code === 100) {
            this.noteList = []
            this.noteList = data.lists
          }
        }
      })
    },
    addNote () {
      let type
      if (this.nowShow === '全部') {
        type = 'all'
      } else if (this.nowShow === '工作') {
        type = 'work'
      } else if (this.nowShow === '学习') {
        type = 'study'
      } else if (this.nowShow === '生活') {
        type = 'life'
      }
      this.editData = {
        id: '',
        type: type,
        content: '',
        title: ''
      }
      this.showAddNote = true
    },
    closeAddNote () {
      this.showAddNote = false
    },
    updateNote(content, title, type, id) {
      let noteInfo = {
        id: id,
        title: title,
        content: content,
        type: type,
        time: dateFormat.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      }
      axios.post('/api/updateNote', noteInfo).then(({status, data}) => {
        if (status === 200){
          if (data.code === 100) {
            this.$Message.success('修改成功')
            this.showAddNote = false
            this.refreshNoteList()
          }
        }
      })
    },
    saveNote (content, title, type) {
      let noteInfo = {
        title: title,
        content: content,
        type: type,
        time: dateFormat.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        uid: this.$store.state.users.id
      }
      axios.post('/api/addNote', noteInfo).then(({status, data}) => {
        if (status === 200){
          if (data.code === 100) {
            this.$Message.success('添加成功')
            this.showAddNote = false
            this.refreshNoteList()
          }
        }
      })
    },
    editNote (item) {
      this.editData = item
      this.showAddNote = true
    },
    deleteNote (id) {
      let noteInfo = {
        id: id
      }
      axios.post('/api/deleteNote', noteInfo).then(({status, data}) => {
        if (status === 200) {
          if (data.code === 100) {
            this.$Message.success('删除成功')
            this.delModel = false
            this.refreshNoteList()
          }
        }
      })
    }
  },
  watch: {
    workNumber1 (val) {
      this.workNumber = val
    },
    lifeNumber1 (val) {
      this.lifeNumber = val
    },
    studyNumber1 (val) {
      this.studyNumber = val
    },
    name () {
      this.getNoteListByName()
    },
    test () {
      let data = {}
      let config = {}
      axios.post('/url',data,config)

      axios({
        methods: 'post',
        url: '/url',
        data: data,
        config: config
      })
    }
  },
  computed: {
    getAllNumber () {
      return this.workNumber + this.lifeNumber + this.studyNumber
    }
  },
  components: {
    addNote
  }
}
</script>

<style scoped>
  .layout-content-main{
    padding: 10px;
    height: 100%;
  }
  .layout-content-main > .title {
    padding: 10px;
  }
  .layout-content-main-content-search{
    padding-top: 20px;
    font-size: 16px;
  }
  .layout-content-main-content-search .nameInput {
    width: 30%;
    display: inline-block;
  }
  .layout-content-main-content-search .nameInput input:focus{
    border: unset !important;
    outline: unset !important;
    box-shadow: unset !important;
  }
  .notelist {
    width: 90%;
    margin:0 auto;
    margin-top: 30px;
    height: calc(100% - 120px);
    overflow-y: auto;
  }
  .notelistitem{
    padding: 6px;
    height: 350px;
  }
  .itemContent{
    border: 1px solid #bdbdbd;
    padding: 10px;
  }
  .listheader{
    width: 100%;
    font-size: 15px;
  }
  .listheader::after{
    content: '';
    display: block;
    clear: both;
  }
  .listheader .title{
    float: left;
    border-bottom: 1px solid #bdbdbd;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: calc(100% - 60px);
  }
  .listheader .headerTools{
    float: right;
  }
  .listheader .headerTools i{
    margin-left: 5px;
    cursor: pointer;
  }
  .listInto{
    margin-top: 10px;
  }
  .listInto::after{
    content: '';
    display: block;
    clear: both;
  }
  .listInto .listTime{
    float: left;
  }
  .listInto .listType{
    float: right;
  }
  .listContent{
    border: 1px solid #f8f8f8;
    margin-top: 10px;
    height: 215px;
  }
</style>
