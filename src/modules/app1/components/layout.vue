<template>
  <div class="app1">
    <header>HEADER</header>
    <div class="content">
      <router-view></router-view>
    </div>
    <footer>FOOTER</footer>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },

  computed: {},

  mounted() {},

  methods: {},
};
</script>

<style scoped lang="less" style="text/less">
.app1 {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #cccccc;
  header {
    height: 50px;
    background-color: #000000;
  }
  footer {
    height: 100px;
    background-color: #000000;
  }
  .content {
    flex: 1;
  }
}
</style>
