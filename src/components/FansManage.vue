<template>
  <div class="fans-manage">
    <fans-list></fans-list>
  </div>
</template>

<script>
import FansList from './FansList'

export default {
  name: 'FansManage',
  components: {
    FansList
  },
  data () {
    return {
      filter: 0,
      fansOpenId: [],
      fansList: [],
      tags: []
    }
  }
}
</script>

<style scoped lang="stylus">
.fans-manage
  margin-left 80px
</style>
