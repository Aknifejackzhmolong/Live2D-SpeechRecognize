<script>
const DEFINES = {

  'ASUNA_SUIT_SCALE': 1.7,
  'ASUNA_SUIT_POSX': 0.0,
  'ASUNA_SUIT_POSY': -0.85,
  'ASUNA_OTHER_SCALE': 1.6,
  'ASUNA_OTHER_POSX': 0.0,
  'ASUNA_OTHER_POSY': -0.4,

  // CanvasID
  'CAN_ID': 'glcanvas',
  // Canvasサイズ
  'CAN_SIZE': 512,
  // キーワードファイル
  'ROOT_PATH': './static/live2d/assets/',
  'KEYWORD_JSON': 'keyword.json',
  // haruモデル（スーツ）
  'MODEL_ASUNA_PATH': './static/live2d/assets/asuna/asuna_44/',
  'MODEL_ASUNA_JSON': 'asuna_44.model.json',
  // haruモデル（メイド）
  'MODEL_REMU_PATH': './static/live2d/assets/rem/',
  'MODEL_REMU_JSON': 'model.json'
}

export default {
  data () {
    return {
      defines: DEFINES
    }
  },
  methods:{
    cssAnim(dom, animName, duration, timing, delay){
      let animDelay = delay | 0
      dom.style.webkitAnimationName = animName
      dom.style.webkitAnimationDuration = duration + "ms"
      dom.style.webkitAnimationTimingFunction = timing
      dom.style.webkitAnimationDelay = animDelay + 's'
      // アニメーション終了時
      dom.addEventListener(DEFINES.ANIM_END, function(ev) {
        // 自身のイベントのみ。再度アニメーション再生できるようにクリアする
        if(ev.target === this) {
          dom.style.webkitAnimationName = ''
        }
      })
    },
    initValue(dom, stroke, fill, cx, cy, r, storokeWidth, btnAnimName, type){
      dom.style.stroke = stroke
      dom.style.fill = fill
      dom.style.cx = cx
      dom.style.cy = cy
      dom.style.r = r
      dom.style.strokeWidth = storokeWidth
      // アニメーション指定なしなら抜ける
      if(!btnAnimName) return
      // マウスクリック時
      dom.addEventListener(DEFINES.TOUCH_CLICK, () => {
        this.$emit('clickFromChild')
        // ボタンアニメーション再生
        this.cssAnim(dom, btnAnimName, DEFINES.ANIM_DURATION/3, DEFINES.ANIM_EASING)
      });
    }
  }
}
</script>

<style>
</style>
