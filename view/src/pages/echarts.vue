<template>
  <div>
    <aside class="title">
      <Breadcrumb>
        <BreadcrumbItem to="/">
          <Icon type="ios-home-outline"></Icon> {{$t('home')}}
        </BreadcrumbItem>
        <BreadcrumbItem to="/charts">
          <Icon type="logo-buffer"></Icon> {{$t('chart')}}
        </BreadcrumbItem>
      </Breadcrumb>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'echarts'
}
</script>

<style scoped>
  .title {
    padding: 20px;
  }
</style>
