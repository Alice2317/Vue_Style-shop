<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import PageComponent from '@/components/PageComponent.vue'

import loadingStore from '@/stores/loadingStore.js'
import { storeToRefs } from 'pinia'

const store = loadingStore()
const { isLoading } = storeToRefs(store)

// 得到產品
const products = ref(null)
const pagination = ref(null)
const isAllProductState = ref(true)
function getProducts (page = 1) {
  isLoading.value = true
  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/products/?page=${page}`

  axios.get(api).then((res) => {
    if (res.data.success) {
      products.value = res.data.products
      pagination.value = res.data.pagination
    }
    isLoading.value = false
  })
}

// 得到分類
const tabs = [
  {
    name: 'men',
    childNodes: []
  },
  {
    name: 'female',
    childNodes: []
  },
  {
    name: 'baby',
    childNodes: []
  }
]
const isTabState = ref(false)

function getTabs () {
  isLoading.value = true
  isTabState.value = false
  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/products/all`

  axios.get(api).then((res) => {
    if (res.data.success) {
      res.data.products.forEach((item) => {
        const array = item.category.split(',')

        const English = array.filter((item) => item.match(/[a-zA-Z]/))

        tabs.forEach((item, index) => {
          if (item.name === English[0]) {
            const Chinese = array.filter((item) =>
              item.match(/[\u4e00-\u9fa5]/)
            )

            const filter = tabs[index].childNodes.findIndex(
              (item) => item === Chinese[0]
            )

            if (filter === -1) {
              tabs[index].childNodes.push(Chinese[0])
            }
          }
        })
      })
      isTabState.value = true
    }
    isLoading.value = false
  }).catch((error) => {
    console.error('productsView-getTabs出錯', error)
    isLoading.value = false
  })
}

onMounted(() => {
  getProducts()
  getTabs()
})

// 篩選產品
function filterProducts (val, name) {
  if (val === 'all') {
    isAllProductState.value = true
    getProducts()
  } else {
    isAllProductState.value = false
    const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
      import.meta.env.VITE_MAIN_NAME
    }/products/all`
    axios.get(api).then((res) => {
      if (res.data.success) {
        if (name) {
          const filterCategoryName = res.data.products.filter((item) => {
            return item.category.match(name)
          })
          products.value = filterCategoryName.filter((item) => {
            return item.category.match(val)
          })
        } else {
          products.value = res.data.products.filter((item) => {
            return item.category.match(val)
          })
        }
      }
    }).catch((error) => {
      console.error('productsView-filterProducts出錯', error)
    })
  }
}
</script>

<template>
  <HeaderComponent />
  <main>
    <div
      class="position-relative d-flex align-items-center justify-content-center"
      style="min-height: 400px"
    >
      <div
        class="position-absolute"
        style="
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-image: url(https://images.unsplash.com/photo-1538438253612-287c9fc9217e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
          background-position: center center;
          opacity: 0.6;
        "
      ></div>
      <h2 class="fw-bold text-uppercase">{{ $route.name }}</h2>
    </div>
    <div class="container mt-md-5 mt-3 mb-7">
      <div class="row">
        <div class="col-md-4">
          <div
            class="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3"
            id="accordionExample"
          >
            <div class="card cursor-pointer border-0">
              <div
                class="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0"
                @click="filterProducts('all')"
              >
                <div
                  class="d-flex justify-content-between align-items-center pe-1"
                >
                  <h5 class="mb-0 text-uppercase">ALL</h5>
                </div>
              </div>
            </div>
            <div class="card cursor-pointer border-0">
              <div
                class="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0"
                @click="filterProducts('新品')"
              >
                <div
                  class="d-flex justify-content-between align-items-center pe-1"
                >
                  <h5 class="mb-0 text-uppercase">NEW</h5>
                </div>
              </div>
            </div>
            <div
              class="card cursor-pointer border-0"
              v-for="item in tabs"
              :key="item.name"
            >
              <div
                class="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0"
                data-bs-toggle="collapse"
                :data-bs-target="`#${item.name}`"
              >
                <div
                  class="d-flex justify-content-between align-items-center pe-1"
                >
                  <h5 class="mb-0 text-uppercase">
                    {{ item.name }}
                  </h5>
                  <i
                    class="fas fa-chevron-down cursor-pointer"
                    v-if="isTabState"
                  ></i>
                </div>
              </div>
              <div
                :id="item.name"
                class="collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
                v-if="isTabState"
              >
                <div class="card-body py-0">
                  <ul class="list-unstyled">
                    <li v-for="tabItem in item.childNodes" :key="tabItem">
                      <router-link
                        :to="{ name: 'products', query: { tabName: tabItem } }"
                        class="py-2 d-block text-muted"
                        @click="filterProducts(tabItem, item.name)"
                        >{{ tabItem }}</router-link
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6" v-for="item in products" :key="item.id">
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
          <PageComponent
            :pagination="pagination"
            @page="getProducts"
            v-if="isAllProductState"
          />
        </div>
      </div>
    </div>
  </main>
  <FooterComponent />
</template>
