<template>
  <div class="singer">
    <ListView :data="singers" @select="selectSinger"></ListView>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
// 类Singer，面向对象方法
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  created() {
    this._getSingerList(1)
  },
  data() {
    return {
      singers: []
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
     this.setSinger(singer)
    },
    _getSingerList(page) {
      getSingerList(page).then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 重新塑造数组
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表，需要处理map
      let hot = []
      let rest = []
      for (let key in map) {
        let val = map[key]
        // 正则a-z或A-Z开头的
        if (val.title.match(/[a-zA-Z]/)) {
          rest.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      rest.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // concat数组连接
      return hot.concat(rest)
    }
  },
  components: {
    ListView
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>
