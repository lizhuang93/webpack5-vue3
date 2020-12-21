<template>
  <router-view></router-view>
</template>

<script>
import HelloWorld from './helloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
<style lang="less">
@import url('@/assets/less/reset.less');
</style>
