<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #F8F8F8;
}
/*定义滚动条轨道 内阴影+圆角*/

::-webkit-scrollbar-track {
  background-color: #F8F8F8;
}
/*定义滑块 内阴影+圆角*/

::-webkit-scrollbar-thumb {
  background-color: #e2e2e2;
}
</style>
