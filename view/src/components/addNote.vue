<template>
  <aside class="addNote">
    <aside class="noteContent">
      <header class="noteHeader">
        <aside class="headerTools">
          <input type="text" placeholder="标题" class="Input" v-model="title" :class="titleNull ? 'errorInput' : ''">
          <aside class="Icon">
            <i class="iconfont icon-save" @click="saveNote"></i>
            <i class="iconfont icon-close1" style="font-size: 20px" @click="closeAddNote"></i>
          </aside>
        </aside>
      </header>
      <aside class="listType">
        分类:
        <Select v-model="type" class="select">
          <Option value="work">工作</Option>
          <Option value="study">学习</Option>
          <Option value="life">生活</Option>
      </Select>
      </aside>
      <quill-editor
        :class="contentNull ? 'errorContent' : ''"
        v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        class="quillEditor"
      >
      </quill-editor>
    </aside>
  </aside>
</template>

<script>
export default {
  name: 'addNote',
  data () {
    return {
      content: '',
      contentNull: false,
      title: '',
      type: 'work',
      titleNull: false,
      editorOption: {
        modules:{
          toolbar:[
            ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
            [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
          ]
        },
        theme:'snow'
      },
    }
  },
  props: {
    NoteData: {
      type: Object
    }
  },
  created () {
    if (JSON.stringify(this.NoteData) !== '{}') {
      this.title = this.NoteData.title
      this.id = this.NoteData.id
      this.content = this.NoteData.content
      this.type = this.NoteData.type
    }
  },
  methods: {
    saveNote () {
      if (this.title === '') {
        this.titleNull = true
      } else {
        this.titleNull = false
      }
      if (this.content === '') {
        this.contentNull = true
      } else {
        this.contentNull = false
      }
      if (!this.contentNull && !this.titleNull) {
        if (this.NoteData.id !== '') {
          this.$emit('updateNote', this.content, this.title, this.type, this.NoteData.id)
        } else {
          this.$emit('saveNote', this.content, this.title, this.type)
        }
      }
    },
    closeAddNote () {
      this.$emit('closeAddNote')
    },
  }
}
</script>

<style scoped>
  .addNote{
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(34, 34, 34, 0.5);
    z-index: 1000;
  }
  .addNote .noteContent{
    width: 300px;
    height: 400px;
    border: 1px solid #f8f8f8;
    border-radius: 3px;
    box-shadow: 0 0 6px 0 #f8f8f8;
    background-color: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .headerTools{
    height: 50px;
    line-height: 50px;
  }
  .headerTools::after{
    content: '';
    display: block;
    clear: both;
  }
  .headerTools .Input{
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
    font-size: 14px;
    border-radius: 4px;
    margin-left: 10px;
    padding-left: 10px;
  }
  .headerTools .Input:focus{
    outline: unset
  }
  .headerTools .Icon{
    display: inline-block;
    float: right;
  }
  .headerTools .Icon i{
    font-size: 17px;
    margin-right: 10px;
    color: #A9A9A9;
    cursor: pointer;
  }
  .noteContent .listType{
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .noteContent .quillEditor{
    width: 95%;
    border-radius: 5px;
    margin: 0 auto;
    height: calc(100% - 95px);
  }
  .headerTools .errorInput, .noteContent .errorContent{
    border: 1px solid red;
  }
  .select{
    width: 30%;
    font-size: 15px;
  }
</style>
