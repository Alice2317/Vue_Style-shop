<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'

import loadingStore from '@/stores/loadingStore.js'
import { storeToRefs } from 'pinia'

const store = loadingStore()
const { isLoading } = storeToRefs(store)

// 得到產品
const products = ref(null)
function getProducts () {
  isLoading.value = true
  const api = `
      ${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/products/all
      `
  axios.get(api).then((res) => {
    if (res.data.success) {
      const result = res.data.products.filter((item) =>
        item.category.match('新品')
      )
      products.value = result.slice(0, 3)
    }
    isLoading.value = false
  }).catch((error) => {
    console.error('cartView-getProducts出錯', error)
    isLoading.value = false
  })
}
onMounted(() => getProducts())

</script>

<template>
  <main class="gsap-box">
    <div class="position-relative">
      <div class="position-absolute home-bg"></div>
      <div class="container d-flex flex-column" style="min-height: 95vh">
        <HeaderComponent />
        <div class="row justify-content-center my-auto">
          <div class="col-md-4 text-center">
            <h2 class="text-primary display-1 text-uppercase gsap-text">style</h2>
            <h5 class="py-3 text-primary gsap-text">
              親膚、高質感、時尚服飾<br />
              首購族5折
            </h5>
            <router-link
              :to="{ name: 'products' }"
              class="btn btn-primary rounded-0"
            >
              快去購買
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row row-cols-1 row-cols-md-3 mt-5">
        <div class="col mt-md-4" v-for="item in products" :key="item.id">
          <div class="card border-0 mb-4 position-relative">
            <router-link
              :to="{ name: 'product', params: { productId: item.id } }"
            >
              <img
                :src="item.imageUrl"
                class="card-img-top rounded-0 cursor-pointer"
                :alt="item.id"
              />
            </router-link>
            <div class="card-body cursor-pointer p-0 px-3">
              <router-link
                class="text-decoration-none"
                :to="{ name: 'product', params: { productId: item.id } }"
              >
                <h4 class="mb-0 mt-3">{{ item.title }}</h4>
                <span class="card-text fs-5 text-danger"
                  >NT$ {{ item.price }}</span
                >
                <span class="text-muted ms-2"
                  ><del>NT$ {{ item.origin_price }}</del></span
                >
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-light mt-7">
      <div class="container py-5">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 text-center">
          <div class="col">
            <i
              class="fas fa-shopping-cart fa-lg bg-primary p-4 text-white rounded-pill"
            ></i>
            <h6 class="text-nowrap mt-3 fw-bold">加入購物車</h6>
            <p>選擇【商品】<br />按【加入購物車】</p>
          </div>
          <div class="col">
            <i
              class="fas fa-pen fa-lg bg-primary p-4 text-white rounded-pill"
            ></i>
            <h6 class="text-nowrap mt-3 fw-bold">資料填寫</h6>
            <p>填寫收件者的基本資料後<br />按【確定付款】</p>
          </div>
          <div class="col">
            <i
              class="fas fa-credit-card fa-lg bg-primary p-4 text-white rounded-pill"
            ></i>
            <h6 class="text-nowrap mt-3 fw-bold">交易結果</h6>
            <p>
              出貨時間約7-14內<br />請於5天內完成取件<br />逾期退回無法重新出貨
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row my-5">
        <div class="col-md-6">
          <img
            src="https://images.unsplash.com/photo-1528494553736-33532ee22168?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt
            class="img-fluid"
          />
        </div>
        <div class="col-md-4 m-auto text-center">
          <h4 class="mt-4 text-uppercase">brand</h4>
          <p class="text-muted">
            我們對自己更高的期許<br />期望在這裡的每一個你都能輕鬆擁有屬於你的美麗
            <br /><br />
            讓美好生活觸手可及<br />堅持不分年齡、性別、身形，讓人人都有追求美麗的自由<br />進而從容展現自信喜悅的美好！
          </p>
        </div>
      </div>
      <div class="row flex-row-reverse justify-content-between mb-5">
        <div class="col-md-6">
          <img
            src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt
            class="img-fluid"
          />
        </div>
        <div class="col-md-4 m-auto text-center">
          <h4 class="mt-4 text-uppercase">ensure</h4>
          <p class="text-muted">
            穿上我們專業選用的天然棉質<br />為您打造柔軟舒適的第二層肌膚<br />營造出輕盈自然的穿著感受<br />進而展現您的自信與優雅！
          </p>
        </div>
      </div>
    </div>
  </main>
  <FooterComponent />
</template>
