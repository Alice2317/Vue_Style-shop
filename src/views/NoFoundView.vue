<template>
  <main class="has-aside-layout has-header-layout">
    <section class="section-layout container py-40 py-lg-80">
      <h1>404</h1>
      <p>找不到頁面，正在跳轉至首頁</p>
    </section>
  </main>
</template>

<script>
export default {
  mounted () {
    setTimeout(() => this.$router.push('/'), 3000)
  }
}
</script>
