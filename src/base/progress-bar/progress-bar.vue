<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import dom from 'common/js/dom'

const PROGRESS_BUTTON = 16
const transform = dom.prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPrecent) {
      if (newPrecent >= 0 && !this.touch.init) {
        const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BUTTON
        const offsetWidth = newPrecent * barWidth
        this._offset(offsetWidth)
      }
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressClick(e) {
      // 点在button上有bug
/*       let offsetWidth = (e.offsetX - PROGRESS_BUTTON / 2)
      this._offset(offsetWidth) */
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left - PROGRESS_BUTTON / 2
      this._offset(offsetWidth)
      this._triggerPresent()
    },
    progressTouchStart(e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BUTTON
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), barWidth)
      this._offset(offsetWidth)
    },
    progressTouchEnd(e) {
      this.touch.init = false
      this._triggerPresent()
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3D(${offsetWidth}px, 0, 0)`
    },
    _triggerPresent() {
      const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BUTTON
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('precentChange', percent)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>