<template>
  <div class="music-list">
    <div class="back" @click="black">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length && payButton">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll :data="songs" class="list" ref="list" :probe-type="probeType" :listen-scroll="listenScroll" @scrollActive="scroll">
      <div class="song-list-wrapper">
        <SongList :songs="songs" @selectItem="selectItem"></SongList>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
// 使用了低配autoprefixer
import dom from 'common/js/dom'
import { mapActions } from 'vuex'

const RESERVED_HEIGHT = 40
const transform = dom.prefixStyle('transform')
const backdrop = dom.prefixStyle('backdrop-filter')
const filter = dom.prefixStyle('filter')

export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: String,
    default: ''
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  data() {
    return {
      scrollY: 0,
      payButton: true
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    black() {
      this.$router.back()
    },
    selectItem(item, index) {
      // 选择传入的时候传入歌手的整个song列表，然后用index取到具体点击歌曲
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      const percent = Math.abs(newY / this.imageHeight)
      // layer遮罩层向上推
      this.$refs.layer.style[transform] = `translate3D(0, ${translateY}px, 0)`
      // 手势向下和向上的情况
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      } else {
        // 恢复正常大小和模糊处理
        scale = 1
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        blur = Math.min(20 * percent, 20)
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        this.$refs.bgImage.style[filter] = `blur(${blur}px)`
      }
      // 到达顶部时
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.payButton = false
        this.$refs.bgImage.style.paddingTop = `${RESERVED_HEIGHT}px`
      } else {
        this.payButton = true
        this.$refs.bgImage.style.paddingTop = '70%'
      }
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>