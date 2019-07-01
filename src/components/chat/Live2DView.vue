<template>
  <canvas id="glcanvas" class="glcanvas" ref="glcanvas" style="display:block;width: 100%;max-width: 500px;height: 95%;"></canvas>
</template>

<script>
import Define from '@/mixins/Define'

const DEFINES = Define.data().defines

export default {
  name: 'Live2DView',
  data() {
    return {
      Live2Dmodeler: null,
      container: null
    }
  },
  methods: {
    init(container){
      this.container = container
      // console.log(container)
      // Live2Dモデルの生成
      this.create_Live2D(DEFINES.MODEL_ASUNA_PATH, DEFINES.MODEL_ASUNA_JSON,
        DEFINES.ASUNA_OTHER_SCALE, DEFINES.ASUNA_OTHER_POSX, DEFINES.ASUNA_OTHER_POSY)
    },
    create_Live2D(modelFilePath, modelFileJson, scale, posX, posY){
      this.Live2Dmodeler = new Live2DRender(
        DEFINES.ROOT_PATH,
        DEFINES.KEYWORD_JSON,
        modelFilePath,
        modelFileJson,
        scale,
        posX,
        posY,
        DEFINES.CAN_ID,
        DEFINES.CAN_SIZE)
      this.Live2Dmodeler.bindListenerContainer(this.container.$el)
    }
  }
}
</script>

<style scoped>
.glcanvas{
    position:absolute;
    top:10px;
    left:0;
    width:601px;
    height:878px;
    z-index: -1;
}
</style>
