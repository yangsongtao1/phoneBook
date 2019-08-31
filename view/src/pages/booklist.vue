<template>
  <div class="layout-content-main">
    <aside class="title">
      <Breadcrumb>
        <BreadcrumbItem to="/">
          <Icon type="ios-home-outline"></Icon> {{$t('home')}}
        </BreadcrumbItem>
        <BreadcrumbItem to="/list">
          <Icon type="logo-buffer"></Icon> {{$t('addressBook')}}
        </BreadcrumbItem>
      </Breadcrumb>
    </aside>
    <aside class="layout-content-main-content">
      <aside class="layout-content-main-content-search">
        <i-input v-model="name" :placeholder="$t('searchInput')" class="nameInput" size="large"></i-input>
        <i-button type="primary" icon="ios-search" size="large" @click="search">{{ $t('search') }}</i-button>
        <i-button type="primary" icon="ios-add" size="large" @click="addPerson">{{ $t('add') }}</i-button>
      </aside>
    </aside>
    <aside class="tipInfo">
      {{$t('tipInfoAfter')}} {{getAllPersonNumber}} {{$t('tipInfoBefore')}}
    </aside>
    <aside class="groups">
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAll"
        class="allCheck"
        @click.prevent.native="handleCheckAll">
        <span class="groupLabel">
          {{$t('allContacts')}}({{getAllPersonNumber}})
        </span>
      </Checkbox>
      <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" class="group">
        <Checkbox :label="group.id" v-for="(group, index) in groups" :key="index">
          <span class="groupLabel">
            {{group.groupName}}({{group.number}})
            <Icon type="ios-close"  class="delGroup" @click.stop="delGroup(group.id)" v-if="group.groupName !== '未分组'"/>
          </span>
        </Checkbox>
      </CheckboxGroup>
    </aside>
    <aside class="phoneList">
      <Col class="listitem" :xs="11" :sm="11" :md="7" :lg="5" v-for="(item, index) in phoneLists" :key="index">
        <aside class="itemContent" @mouseover="showID(item.id)">
          <p class="itemContentHeader" :style="{background: item.groupColor}">{{item.name}}</p>
          <i-col span="15" class="itemInfo">
            <p>{{ $t('groups') }}: <span>{{item.groupName}}</span></p>
            <p>{{ $t('phone') }}: <span>{{item.mobile}}</span></p>
            <p>QQ: <span>{{item.QQ}}</span></p>
            <p class="address" :title="item.address">{{ $t('address') }}: <span>{{item.address}}</span></p>
          </i-col>
          <i-col span="9" class="avator">
            <img :src="item.avator" alt="" class="avatorImg">
          </i-col>
          <aside class="itemtipcontent">
            <aside class="itemtip">
              <Poptip
                confirm
                trigger="hover"
                :title="$t('delTip')"
                @on-ok="delitem"
                @on-cancel="cancel">
                <p class="del">{{$t('del')}}</p>
              </Poptip>
              <p class="showInfo" @click="showInfo(item.id)">{{$t('info')}}</p>
            </aside>
          </aside>
        </aside>
      </Col>
    </aside>
    <add-contact v-if="isShowAddContact" @cancelAdd="cancelAdd" :groups="groups" @addGroup="addGroups" @addSuccess="addSuccess"></add-contact>
    <add-group v-if="isShowAddGroup" @cancelAddGroup="cancelAddGroup" @confirmAddGroup="confirmAddGroup"/>
  </div>
</template>

<script>
import addContact from "../components/addcontact"
import addGroup from "../components/addgroup"
import axios from '../axios'
export default {
  name: 'booklist',
  data () {
      return {
        nowItemId: 0,
        name: '',
        groups: [],
        AllPerosnNumber: 0,
        indeterminate: false,
        checkAll: true,
        isShowAddContact: false,
        isShowAddGroup: false,
        checkAllGroup: [],
        checkAllGroupCopy: [],
        phoneLists: []
      }
  },
  mounted () {
    this.getGroupList()
  },
  computed: {
    getAllPersonNumber: function () {
      let i = 0
      let AllPerosnNumber = 0
      for (i = 0; i < this.groups.length; i++) {
        AllPerosnNumber += this.groups[i].number
      }
      return AllPerosnNumber
    }
  },
  methods: {
    //目前鼠标放置的id
    showID: function (id) {
      this.nowItemId = id
    },
    getPhoneList: function (arr) {
      if (arr.length <= 0) {
        this.phoneLists = []
      } else {
        let temp = arr.join(',')
        axios.get('/api/getPhoneList', {params: {gids: temp}}).then(({status, data}) => {
          if (data.code === 100) {
            this.phoneLists = data.lists
          }
        })
      }
    },
    getGroupList: function () {
      axios.get('/api/grouplist', {params: {uid: this.$store.state.users.id }}).then(({status, data}) => {
        if (data.code === 100) {
          this.checkAllGroup = data.group.map( (item) => {
            return item.id
          })
          this.checkAllGroupCopy = data.group.map( (item) => {
            return item.id
          })
          this.getPhoneList(this.checkAllGroup)
          this.groups = data.group
        }
      })
    },
    delitem: function () {
      let delid = {
        id: this.nowItemId
      }
      axios.post('/api/delPhoneListByID', delid).then(({status, data}) => {
        if (data.code === 100) {
          this.$Message.success(this.$t('success'))
          this.getGroupList()
        } else {
          this.$Message.error(this.$t('fail'))
        }
      })
    },
    addPerson: function () {
      this.isShowAddContact = true
    },
    cancelAdd: function () {
      this.isShowAddContact = false
    },
    addSuccess () {
      this.getGroupList()
      this.isShowAddContact = false
    },
    showInfo: function (id) {
      this.$router.push({
        path: `/info/${id}`,
      })
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = this.checkAllGroupCopy;
      } else {
        this.checkAllGroup = [];
      }
      this.getPhoneList(this.checkAllGroup)
    },
    checkAllGroupChange (data) {
      if (data.length === this.groups.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
      this.getPhoneList(data)
    },
    search: function () {
      console.log(this.name)
    },
    delGroup: function (id) {
      let gruopInfo = {
        id: id,
        uid: this.$store.state.users.id
      }
      this.$Modal.confirm({
        title: this.$t('tip'),
        content: this.$t('delGroupTip'),
        okText: this.$t('YesDel'),
        cancelText: this.$t('notDel'),
        onOk: () => {
          axios.post('/api/DelGroupAndPhone', gruopInfo).then(({status, data}) => {
            if (data.code === 100) {
              this.$Message.info('Clicked ok');
              this.getGroupList()
            }
          })
        },
        onCancel: () => {
          axios.post('/api/onlyDelGroup', gruopInfo).then(({status, data}) => {
            if (data.code === 100) {
              this.$Message.info('Clicked cancel');
              this.getGroupList()
            }
          })
        }
      });
    },
    addGroups () {
      this.isShowAddGroup = true
    },
    cancel() {},
    cancelAddGroup () {
      this.isShowAddGroup = false
    },
    confirmAddGroup () {
      this.getGroupList()
      this.isShowAddGroup = false
    }
  },
  components: {
    addContact,
    addGroup
  }
}
</script>

<style scoped>
  @import "../assets/css/booklist.css";
</style>
