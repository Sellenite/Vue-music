<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots"></div>
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
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
    }, 20)
  },
  methods: {
    _setSliderWidth() {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let slideWidth = this.$refs.slider.clientWidth

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        classOption.toggleClass(child, 'slider-item')
        child.style.width = slideWidth + 'px'
        width += slideWidth
      }

      if (this.loop) {
        // 添加两个单位的宽度，用来循环
        width += 2 * slideWidth
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
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
        snapThreshold: 0.3,
        // 允许点击
        click: true
      })
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