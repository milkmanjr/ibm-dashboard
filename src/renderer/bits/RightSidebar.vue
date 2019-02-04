<template>
  <aside class="right-sidebar">
    <div class="highlights">
      <labeled-value v-for="(h, index) in highlights" :key="index" :highlight="h"></labeled-value>
    </div>
  </aside>
</template>

<script>
  export default {
    data () {
      return {
        highlights: this.points || []
      }
    },
    props: ['points'],
    components: {
      'labeled-value': require('@/bits/LabeledValueSidebar')
    }
  }
</script>

<style lang="scss">
  .right-sidebar {
    .highlights {
      height: 100%;
      padding: 2em;
      background-color: rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;

      .labeled-value {
        margin-bottom: 4em;
      }
    }
  }
</style>
