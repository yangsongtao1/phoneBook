<template>
  <div>
    <aside class="title">
      <Breadcrumb>
        <BreadcrumbItem to="/">
          <Icon type="ios-home-outline"></Icon> {{$t('home')}}
        </BreadcrumbItem>
        <BreadcrumbItem to="/list">
          <Icon type="logo-buffer"></Icon> {{$t('addressBook')}}
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Icon type="ios-cafe"></Icon> {{$t('detailed')}}
        </BreadcrumbItem>
      </Breadcrumb>
    </aside>
    <div class="detail">
      <div class="Info">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="form">
          <FormItem :label="$t('addname')" prop="name">
            <Input v-model="formValidate.name" :placeholder="$t('inputname')" :disabled="!isChange"></Input>
          </FormItem>
          <FormItem :label="$t('addemail')" prop="email">
            <Input v-model="formValidate.email" :placeholder="isChange ? $t('inputemail') : '无' " :disabled="!isChange"></Input>
          </FormItem>
          <FormItem :label="$t('addQQ')" prop="QQ">
            <Input v-model="formValidate.QQ" :placeholder="isChange ? $t('inputqq') : '无'" :disabled="!isChange"></Input>
          </FormItem>
          <FormItem :label="$t('addgroup')" prop="gid" v-if="!isChange">
            <Input v-model="formValidate.groupName" disabled></Input>
          </FormItem>
          <FormItem :label="$t('addgroup')" prop="gid" v-else>
            <Col span="16">
              <Select v-model="formValidate.gid">
                <Option v-for="item in groupsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="7" offset="1">
              <Button @click="addGroups" class="addGroups" type="primary">{{$t('addgroups')}}</Button>
            </Col>
          </FormItem>
          <FormItem :label="$t('addmobilephone')" prop="mobile">
            <Input v-model="formValidate.mobile" :placeholder="isChange ? $t('inputmobilephone') : '无'" :disabled="!isChange"></Input>
          </FormItem>
          <FormItem :label="$t('addphone')" prop="phone">
            <Input v-model="formValidate.phone" :placeholder="isChange ? $t('inputphone') : '无'" :disabled="!isChange"></Input>
          </FormItem>
          <FormItem :label="$t('sex')" prop="gender" v-if="!isChange">
            <Input value="男" :disabled="!isChange" v-if="formValidate.sex === 'male'"></Input>
            <Input value="女" :disabled="!isChange" v-else></Input>
          </FormItem>
          <FormItem :label="$t('sex')" prop="gender" v-else>
            <RadioGroup v-model="formValidate.sex">
              <Radio label="male">{{$t('man')}}</Radio>
              <Radio label="wmale">{{$t('woman')}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem :label="$t('hobby')" prop="hobby">
            <CheckboxGroup v-model="formValidate.hobby">
              <Checkbox :label="$t('eat')" :disabled="!isChange"></Checkbox>
              <Checkbox :label="$t('sleep')" :disabled="!isChange"></Checkbox>
              <Checkbox :label="$t('run')" :disabled="!isChange"></Checkbox>
              <Checkbox :label="$t('movie')" :disabled="!isChange"></Checkbox>
              <Checkbox :label="$t('read')" :disabled="!isChange"></Checkbox>
              <Checkbox :label="$t('tour')" :disabled="!isChange"></Checkbox>
              <Checkbox :label="$t('other')" :disabled="!isChange"></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem :label="$t('desc')" prop="remark">
            <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('inputdesc')" :disabled="!isChange"></Input>
          </FormItem>
          <aside class="buttonGroup">
            <Button type="primary" @click="handleSubmit('formValidate')">{{$t('submit')}}</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{$t('revisions')}}</Button>
            <Button @click="cancelForm" style="margin-left: 8px" v-if="isChange">{{$t('cancel')}}</Button>
            <Button @click="goBack" style="margin-left: 8px" v-else>{{$t('goBack')}}</Button>
          </aside>
        </Form>
      </div>
      <div class="avator">
        <img class="avatorImg" :src="formValidate.avator">
      </div>
    </div>
    <add-group v-if="isShowAddGroup" @cancelAddGroup="cancelAddGroup" @confirmAddGroup="confirmAddGroup"/>
  </div>
</template>

<script>
import axios from '../axios'
import addGroup from "../components/addgroup"
export default {
  name: "booklistInfo",
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
      groups: [],
      isShowAddGroup: false,
      isChange: false,
      formValidate: {
        name: '',
        age: '',
        sex: '',
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
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      axios.get('/api/getPhoneListById', {params: {id: this.$route.params.id}}).then(({status, data}) => {
        if (status === 200) {
          if (data.code === 100) {
            this.formValidate = data.list
            this.formValidate.hobby = this.formValidate.hobby.split(',')
          }
        }
      })
    },
    addGroups () {
      this.isShowAddGroup = true
    },
    cancelAddGroup () {
      this.isShowAddGroup = false
    },
    confirmAddGroup () {
      this.getGroupList()
      this.isShowAddGroup = false
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
            axios.post('/api/updataPhonelistById', contactInfo).then(({status, data}) => {
              if (status === 200) {
                if (data.code === 100) {
                  this.$Message.success(this.$t('success'))
                  this.isChange = false
                }
              }
            })
          } else {
            this.$Message.error(this.$t('fail'))
          }
      })
    },
    cancelForm() {
      this.isChange = false
    },
    goBack () {
      this.$router.back(-1)
    },
    handleReset () {
      this.isChange = true
      this.getGroupList()
    },
    getGroupList: function () {
      axios.get('/api/grouplist', {params: {uid: this.$store.state.users.id }}).then(({status, data}) => {
        if (status === 200) {
          if (data.code === 100) {
            this.groups = data.group
            this.getGroupsList()
          }
        }
      })
    },
    getGroupsList () {
      this.groupsList = []
      let i, temp
      for (i = 0; i < this.groups.length; i++) {
        temp = {}
        temp.value = this.groups[i].id
        temp.label = this.groups[i].groupName
        this.groupsList.push(temp)
      }
    },
  },
  components: {
    addGroup
  }
}
</script>

<style scoped>
  .title {
    padding: 20px;
  }
  .detail{
    display: flex;
  }
  .detail .Info{
    width: 60%;
  }
  .detail .avator{
    margin: 0 auto;
  }
  .detail .avator .avatorImg{
    width: 30vw;
    height: 30vw;
    max-width: 300px;
    max-height: 300px;
    border-radius: 30vw;
  }
  .buttonGroup {
    text-align: center;
    margin-top: 20px;
  }
  @media screen and (max-width: 1024px){
    .detail .avator .avatorImg{
      width: 180px;
      height: 180px;
      border-radius: 180px;
    }
  }
</style>
