<template>
  <Scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scrollActive="scroll" :probeType="3">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.avatar" class="avatar" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" :data-index="index" :class="{current: currentIndex === index}">{{ item }}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="scrollY <= 0" ref="fixed">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import dom from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = parseInt(dom.toggleData(e.target, 'index'))
      // 边界处理，和点击到0的情况
      if (!anchorIndex && anchorIndex !== 0) {
        return
      }
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this.currentIndex = anchorIndex
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 或0可以做向下取整
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = this.touch.anchorIndex + delta
      // 滑动超出边界情况
      if (anchorIndex < 0) {
        anchorIndex = 0
      } else if (anchorIndex > this.listHeight.length - 1) {
        anchorIndex = this.listHeight.length - 1
      }
      this.currentIndex = anchorIndex
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    selectItem(item) {
      this.$emit('select', item)
    },
    _calculateHeight() {
      this.listHeight = []
      const listGroup = this.$refs.listGroup
      for (let i = 0; i < listGroup.length; i++) {
        let offsetTop = listGroup[i].offsetTop
        this.listHeight.push(offsetTop)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部再往上拉
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (!height2 || (-newY >= height1 && -newY < height2)) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      this.currentIndex = 0
    },
    diff(newDiff) {
      let fixedTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0
      // 以下代码可以限制dom操作，防止多次修改
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3D(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
