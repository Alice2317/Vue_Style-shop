<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
</script>

<template>
  <div class="position-relative d-flex">
    <div class="container d-flex flex-column" style="min-height: 100vh">
      <HeaderComponent />
      <div class="row my-auto pb-7">
        <div class="col-md-4 d-flex flex-column">
          <div class="my-auto">
            <h2>交易成功</h2>
            <p>
              送貨需要7-14天工作日，商品鑑賞期為7天。<br />
              若商品有任何瑕疵都可以退換貨。<br />
              若有任何問題，歡迎來電客服！
            </p>
            <router-link :to="{ name: 'cart' }" class="btn btn-dark mt-4 px-5"
              >回購物車</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <div class="w-md-50 w-100 position-absolute opacity-1 bg"></div>
  </div>
</template>
