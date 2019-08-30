<template>
    <div class="addBackground">
      <aside class="content">
        <aside class="title">{{$t('add')}}</aside>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="form">
          <FormItem :label="$t('addname')" prop="name" required>
            <Input v-model="formValidate.name" :placeholder="$t('inputname')"></Input>
          </FormItem>
          <FormItem :label="$t('addemail')" prop="email">
            <Input v-model="formValidate.email" :placeholder="$t('inputemail')"></Input>
          </FormItem>
          <FormItem :label="$t('addQQ')" prop="QQ">
            <Input v-model="formValidate.QQ" :placeholder="$t('inputqq')"></Input>
          </FormItem>
          <FormItem :label="$t('addgroup')" prop="gid">
            <Col span="16">
              <Select v-model="formValidate.gid">
                <Option v-for="item in groupsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="7" offset="1">
              <Button @click="addGroups" class="addGroups" type="primary">{{$t('addgroups')}}</Button>
            </Col>
          </FormItem>
          <FormItem :label="$t('addmobilephone')" prop="mobile" required>
            <Input v-model="formValidate.mobile" :placeholder="$t('inputmobilephone')"></Input>
          </FormItem>
          <FormItem :label="$t('addphone')" prop="phone">
            <Input v-model="formValidate.phone" :placeholder="$t('inputphone')"></Input>
          </FormItem>
          <FormItem :label="$t('sex')" prop="gender">
            <RadioGroup v-model="formValidate.sex">
              <Radio label="male">{{$t('man')}}</Radio>
              <Radio label="wmale">{{$t('woman')}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem :label="$t('hobby')" prop="hobby">
            <CheckboxGroup v-model="formValidate.hobby">
              <Checkbox :label="$t('eat')"></Checkbox>
              <Checkbox :label="$t('sleep')"></Checkbox>
              <Checkbox :label="$t('run')"></Checkbox>
              <Checkbox :label="$t('movie')"></Checkbox>
              <Checkbox :label="$t('read')"></Checkbox>
              <Checkbox :label="$t('tour')"></Checkbox>
              <Checkbox :label="$t('other')"></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem :label="$t('desc')" prop="remark">
            <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('inputdesc')"></Input>
          </FormItem>
          <aside class="buttonGroup">
            <Button type="primary" @click="handleSubmit('formValidate')">{{$t('submit')}}</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{$t('reset')}}</Button>
            <Button @click="cancelForm" style="margin-left: 8px">{{$t('cancel')}}</Button>
          </aside>
        </Form>
      </aside>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'addcontact',
  data () {
    let validateQQ = (rule, value, callback) => {
      const reg = /^[1-9][0-9]{4,9}$/gim
      if (value === '') {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error(this.$t('inputQQError')))
        } else {
          callback()
        }
      }
    }
    let validateMobile = (rule, value, callback) => {
      const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('inputMobileError')))
      } else {
        callback()
      }
    }
    let validatePhone = (rule, value, callback) => {
      const reg = /0\d{2,3}-\d{7,8}/
      if (value === '') {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error(this.$t('inputPhoneError')))
        } else {
          callback()
        }
      }
    }
    return {
      groupsList: [],
      formValidate: {
        name: '',
        age: '',
        sex: 'male',
        phone: '',
        QQ: '',
        email: '',
        avator: '',
        mobile: '',
        address: '',
        remark: '',
        hobby: [],
        gid: '',
      },
      ruleValidate: {
        name: [
          { required: true, message: this.$t('inputname') , trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: this.$t('inputmobilephone'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: this.$t('inputEmailError'), trigger: 'blur' }
        ],
        QQ: [
          { validator: validateQQ, trigger: 'blur'}
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur'}
        ]
      }
    }
  },
  props: {
    groups: {
      required: true,
      type: Array
    }
  },
  mounted () {
    this.getGroupsList()
  },
  watch: {
    groups: function (val) {
      this.getGroupsList()
    }
  },
  methods: {
    getGroupsList () {
      this.groupsList = []
      let i, temp
      for (i = 0; i < this.groups.length; i++) {
        temp = {}
        temp.value = this.groups[i].id
        temp.label = this.groups[i].groupName
        if (this.groups[i].groupName === '未分组') {
          this.formValidate.gid = this.groups[i].id
        }
        this.groupsList.push(temp)
      }
    },
    handleSubmit (name) {
      let contactInfo = {}
      for (var key in this.formValidate) {
        if (this.formValidate.hasOwnProperty(key)) {
          if (key === 'hobby') {
            contactInfo[key] = this.formValidate[key].join(',')
          } else {
            contactInfo[key] = this.formValidate[key];
          }
        }
      }
      if (contactInfo.age === '') {
        contactInfo.age = null
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          axios.post('/api/addContact', contactInfo).then(({status, data}) => {
            if (status === 200) {
              if (data.code === 100) {
                this.$Message.success(this.$t('success'))
                this.$emit('addSuccess')
              }
            }
          })
        } else {
          this.$Message.error(this.$t('fail'));
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    cancelForm () {
      this.$emit('cancelAdd')
    },
    addGroups () {
      this.$emit('addGroup')
    }
  },
  components: {
  }
}
</script>

<style scoped>
  .addBackground{
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }
  .addBackground .content{
    position: absolute;
    background: #fff;
    width: 50%;
    height: 650px;
    min-height: 650px;
    min-width: 450px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .addBackground .content .form{
    width: 70%;
    margin: 0 auto;
  }
  .addBackground .content .addGroups{
    width: 100%;
  }
  .addBackground .content .title{
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    color: #000;
    text-align: center;
  }
  .addBackground .buttonGroup{
    text-align: center;
  }
</style>
