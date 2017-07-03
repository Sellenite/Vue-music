<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{'active': currentPageIndex === index}" @click="changePage(index)"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import classOption from 'common/js/dom'

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      // dot的高亮索引
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 优化，改变窗口时仍然能够计算宽度
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    // 获得slider单个和group的长度
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      // 一张图片一个屏幕的单位长度
      let slideWidth = this.$refs.slider.clientWidth

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        classOption.addClass(child, 'slider-item')
        child.style.width = slideWidth + 'px'
        width += slideWidth
      }

      if (this.loop && !isResize) {
        // 添加两个单位的宽度，用来循环
        width += 2 * slideWidth
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化slider
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        // 滚动方向为X轴
        scrollX: true,
        scrollY: false,
        // 快速滑动时是否开启惯性
        momentum: false,
        // 开启轮播，之间需要计算长度
        snap: true,
        // 是否循环，计算长度时父元素需要添加两个单位的长度
        snapLoop: this.loop,
        // 切换动画时间
        snapSpeed: 400,
        // 切换阈值，大于阈值可以下一页
        snapThreshold: 0.3
      })

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    // 初始化索引
    _initDots() {
      this.dots = new Array(this.$refs.sliderGroup.children.length)
    },
    // 用于自动轮播
    _play() {
      let pageIndex = this.currentPageIndex + 1
      // 注意loop时会多出两份在两旁
      if (this.loop) {
        pageIndex += 1
      }
      console.log(pageIndex)
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    },
    // 点击索引切换
    changePage(index) {
      this.currentPageIndex = index
      let _index = index
      if (this.loop) {
        _index += 1
      }
      this.slider.goToPage(_index, 0, 400)
      if (this.autoPlay) {
        clearTimeout(this.timer)
        this._play()
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>