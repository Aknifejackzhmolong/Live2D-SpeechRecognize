<template>
    <div>
      <!--<mt-header fixed title="chat robot"></mt-header>-->
      <heads/>
      <chat-list ref="container"/>
      <live2d ref="live2d"/>
    </div>
</template>

<script>
    import Heads from './Heads'
    import ChatList from './ChatList'
    import live2d from './Live2DView'
    export default {
        name: "chat",
        components: {
          Heads,
          ChatList,
          live2d
        },
        mounted() {
          this.$refs.live2d.init(this.$refs.container)
        }
    }
</script>

<style scoped>

</style>
