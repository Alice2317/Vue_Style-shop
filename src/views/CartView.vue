<script setup>
import axios from 'axios'
import { toast } from '@/assets/js/swal.js'
import { ref } from 'vue'
import { currency } from '@/assets/js/methods.js'

import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import autoplaySwiper from '@/components/autoplaySwiper.vue'

import loadingStore from '@/stores/loadingStore.js'
import cartStore from '@/stores/cartStore'
import { storeToRefs } from 'pinia'

const currencyFn = ref(currency)

const store = loadingStore()
const { isLoading } = storeToRefs(store)

// 得到購物車
const importCartStore = cartStore()
const { finalTotal, total, carts } = storeToRefs(importCartStore)
const { getCarts } = importCartStore

// 調整數量
function updateCount (state, id, val) {
  if (state) {
    if (val >= 10) {
      return
    }
  } else {
    if (val <= 1) {
      return
    }
  }
  isLoading.value = true
  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/cart/${id}`
  axios
    .put(api, { data: { product_id: id, qty: state ? ++val : --val } })
    .then((res) => {
      if (res.data.success) {
        toast(true, '成功')
        getCarts()
      } else {
        toast(false, '失敗，請重新操作')
      }
      isLoading.value = false
    })
    .catch((error) => {
      toast(false, '失敗，請重新操作')
      console.error('cartView-updateCount出錯', error)
      isLoading.value = false
    })
}

function InputText (id, val) {
  if (val > 10 || val < 1) {
    return
  }
  isLoading.value = true
  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/cart/${id}`
  axios
    .put(api, { data: { product_id: id, qty: Number(val) } })
    .then((res) => {
      if (res.data.success) {
        toast(true, '成功')
        getCarts()
      } else {
        toast(false, '失敗，請重新操作')
      }
      isLoading.value = false
    })
    .catch((error) => {
      toast(false, '失敗，請重新操作')
      console.error('cartView-InputText出錯', error)
      isLoading.value = false
    })
}

// 刪除訂單
function removeCart (id) {
  isLoading.value = true
  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/cart/${id}`
  axios
    .delete(api)
    .then((res) => {
      if (res.data.success) {
        toast(true, '已成功刪除')
        getCarts()
      } else {
        toast(false, '失敗，請重新操作')
      }
      isLoading.value = false
    })
    .catch((error) => {
      toast(false, '失敗，請重新操作')
      console.error('cartView-removeCart出錯', error)
      isLoading.value = false
    })
}

// 送出優惠碼
const code = ref(null)
function couponSubmit () {
  if (code.value !== '') {
    const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
      import.meta.env.VITE_MAIN_NAME
    }/coupon`
    isLoading.value = true
    axios
      .post(api, { data: { code: code.value } })
      .then((res) => {
        if (res.data.success) {
          toast(true, '已更新商品價格')
          getCarts()
        } else {
          toast(false, '失敗，請重新操作')
        }
        isLoading.value = false
      })
      .catch((error) => {
        toast(false, '失敗，請重新操作')
        console.error('cartView-couponSubmit出錯', error)
        isLoading.value = false
      })
  }
}

// 剪貼簿複製功能
function copyCode (e) {
  const target = e.target.closest('span').innerText
  navigator.clipboard.writeText(target)
  toast(true, '已成功複製')
}
</script>

<template>
  <HeaderComponent />
  <main class="container">
    <div class="mt-3" v-if="carts?.length">
      <h3 class="mt-3 mb-4 fw-bold">訂單確認</h3>
      <div class="row">
        <div class="col-md-8">
          <table class="table">
            <thead class="border-bottom">
              <tr>
                <th scope="col" class="border-0 ps-0">商品</th>
                <th scope="col" class="border-0">數量</th>
                <th scope="col" class="border-0">價格</th>
                <th scope="col" class="border-0"></th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-bottom" v-for="item in carts" :key="item.id">
                <th scope="row" class="border-0 px-0 font-weight-normal py-4">
                  <img
                    :src="item.product.imageUrl"
                    :alt="item.id"
                    style="width: 72px; height: 72px; object-fit: cover"
                  />
                  <p class="mb-0 fw-bold ms-3 d-inline-block">
                    {{ item.product.title }}
                  </p>
                </th>
                <td class="border-0 align-middle" style="max-width: 160px">
                  <VForm v-slot="{ errors }">
                    <div class="input-group pe-5">
                      <div class="input-group-prepend">
                        <button
                          class="btn btn-outline-dark border-0 py-2"
                          type="button"
                          id="button-addon1"
                          @click="updateCount(false, item.id, item.qty)"
                        >
                          <i class="fas fa-minus"></i>
                        </button>
                      </div>
                      <VField
                        name="number"
                        class="form-control border-0 text-center my-auto shadow-none"
                        :class="{ 'is-invalid': errors['number'] }"
                        rules="required|integer|between:1,10"
                        v-model="item.qty"
                        @change="InputText(item.id, item.qty)"
                      />
                      <div class="input-group-append">
                        <button
                          class="btn btn-outline-dark border-0 py-2"
                          type="button"
                          id="button-addon2"
                          @click="updateCount(true, item.id, item.qty)"
                        >
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </VForm>
                </td>
                <td class="border-0 align-middle">
                  <p class="mb-0 ms-auto">NT$ {{ item.product.price }}</p>
                </td>
                <td class="border-0 align-middle">
                  <button
                    class="btn"
                    type="button"
                    @click="removeCart(item.id)"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="input-group w-50 mb-3">
            <input
              type="text"
              class="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none"
              placeholder="請輸入優惠碼"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              v-model="code"
            />
            <div class="input-group-append">
              <button
                class="btn btn-outline-dark border-bottom border-top-0 border-start-0 border-end-0 rounded-0"
                type="button"
                id="button-addon2"
                @click="couponSubmit"
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item px-0 d-flex align-items-center">
              <span>首購族優惠碼：</span>
              <button
                type="button"
                class="btn p-0 m-0"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="copy"
                @click="copyCode"
              >
                <span
                  >first5off<i class="far fa-copy ms-2 cursor-pointer"></i
                ></span>
              </button>
            </li>
          </ul>
        </div>
        <div class="col-md-4">
          <div class="border p-4 mb-4">
            <h4 class="fw-bold mb-4">金額</h4>
            <table class="table text-muted border-bottom">
              <tbody>
                <tr>
                  <th scope="row" class="border-0 px-0 pt-4 font-weight-normal">
                    總金額
                  </th>
                  <td class="text-end border-0 px-0 pt-4">
                    NT$ {{ currencyFn(total) }}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    class="border-0 px-0 pt-0 pb-4 font-weight-normal"
                  >
                    折扣價
                  </th>
                  <td class="text-end border-0 px-0 pt-0 pb-4">
                    {{
                      finalTotal - total === 0
                        ? 0
                        : currencyFn(Math.round(finalTotal - total))
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-between mt-4">
              <p class="mb-0 h4 fw-bold">Total</p>
              <p class="mb-0 h4 fw-bold">
                NT$ {{ currencyFn(Math.round(finalTotal)) }}
              </p>
            </div>
            <router-link :to="{ name: 'pay' }" class="btn btn-dark w-100 mt-4"
              >下一步</router-link
            >
          </div>
        </div>
      </div>
    </div>

    <div class="py-6" v-else>
      <h3 class="fw-bold text-center">尚未購買商品</h3>
      <p class="text-center">首購族打5折優惠，快來選購</p>
    </div>
    <div class="my-5">
      <autoplaySwiper />
    </div>
  </main>
  <FooterComponent />
</template>
