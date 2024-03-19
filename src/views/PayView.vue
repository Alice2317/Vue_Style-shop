<script setup>
import axios from 'axios'
import { toast } from '@/assets/js/swal.js'
import { currency } from '@/assets/js/methods.js'
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { bank } from '@/assets/js/bank.js'
import loadingStore from '@/stores/loadingStore.js'
import cartStore from '@/stores/cartStore'
import FooterComponent from '@/components/FooterComponent.vue'

const currencyFn = ref(currency)

const store = loadingStore()
const { isLoading } = storeToRefs(store)

// 得到購物車
const importCartStore = cartStore()
const { finalTotal, carts, total } = storeToRefs(importCartStore)
const { getCarts } = importCartStore
onBeforeMount(() => getCarts())

// 得到收件者資料
const router = useRouter()
const user = ref({
  email: '',
  tel: '',
  name: '',
  address: ''
})
const message = ref(null)
function isPhone (value) {
  const phoneNumber = /^(09)[0-9]{8}$/
  return phoneNumber.test(value) ? true : '需要正確的電話號碼'
}

async function userAPI (val) {
  let state = false

  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/order`
  await axios
    .post(api, {
      data: {
        user: user.value,
        message: message.value
      }
    })
    .then((res) => {
      if (res.data.success) {
        payAPI(res.data.orderId)
        state = true
      } else {
        state = false
      }
    })
    .catch((error) => {
      console.error('payView-userAPI出錯', error)
    })
  return state
}

// 得到付款資料
const isClickPay = ref(false)

function payToggle (state) {
  isClickPay.value = state
}

const text = ref(['5465', '4465', '5466', '5645'])
const date = ref(['04', '12'])
const code = ref('486')
const bankList = ref(bank)
const bankContent = ref('4 臺灣銀行國際金融業務分行')

async function payAPI (id) {
  let state = false

  const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${
    import.meta.env.VITE_MAIN_NAME
  }/pay/${id}`
  await axios
    .post(api)
    .then((res) => {
      if (res.data.success) {
        state = true
      } else {
        state = false
      }
    }).catch((error) => {
      console.error('payView-payAPI出錯', error)
    })
  return state
}

async function paySubmit () {
  isLoading.value = false
  const userState = await userAPI()
  const payState = await payAPI()

  if (userState === true && payState === true) {
    isLoading.value = true
    toast(true, '交易成功，正在跳轉至交易明細頁面')
    setTimeout(() => {
      user.value = {
        name: '',
        email: '',
        tel: '',
        address: ''
      }
      message.value = ''
    }, 5000)
    router.push({ name: 'order' })
  } else {
    toast(false, '失敗，請重新操作')
  }
}
</script>

<template>
  <main class="container">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <nav class="navbar navbar-expand-lg navbar-light px-0">
          <router-link class="navbar-brand ff-serif" to="/">style</router-link>
          <ul
            class="list-unstyled mb-0 ms-md-auto d-flex align-items-center justify-content-between justify-content-md-end w-100 px-2 px-sm-6 px-md-0 mt-md-0 mt-4"
          >
            <li class="me-md-6 me-3 position-relative custom-step-line">
              <i
                class="fas fa-check-circle d-md-inline d-block text-center me-2"
              ></i>
              <span class="text-nowrap">訂單確認</span>
            </li>
            <li class="me-md-6 me-3 position-relative custom-step-line">
              <i
                class="fas fa-dot-circle d-md-inline d-block text-center me-2"
              ></i>
              <span class="text-nowrap">資料填寫</span>
            </li>
            <li>
              <i
                class="fas fa-dot-circle d-md-inline d-block text-center me-2"
              ></i>
              <span class="text-nowrap">交易結果</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-10">
        <h3 class="fw-bold mb-4 pt-3">資料填寫</h3>
      </div>
    </div>
    <div class="row flex-row-reverse justify-content-center pb-5">
      <div class="col-md-4">
        <div class="border p-4 mb-4">
          <div class="d-flex mt-2" v-for="item in carts" :key="item.id">
            <img
              :src="item.product.imageUrl"
              :alt="item.product.id"
              class="me-2"
              style="width: 48px; height: 48px; object-fit: cover"
            />
            <div class="w-100">
              <div class="d-flex justify-content-between">
                <p class="mb-0 fw-bold">{{ item.product.title }}</p>
                <p class="mb-0">NT$ {{ item.product.price }}</p>
              </div>
              <p class="mb-0 fw-bold">x {{ item.qty }}</p>
            </div>
          </div>
          <table class="table mt-4 border-top border-bottom text-muted">
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
                  NT$
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
        </div>
      </div>
      <div class="col-md-6">
        <VForm v-slot="{ errors }" @submit="paySubmit">
          <div class="mb-2">
            <label for="ContactMail" class="text-muted mb-0"
              >Email<span class="text-danger fw-bold">*</span></label
            >
            <VField
              type="email"
              class="form-control"
              id="ContactMail"
              name="email"
              :class="{ 'is-invalid': errors['email'] }"
              placeholder="請輸入EMAIL"
              rules="email|required"
              v-model="user.email"
            />
            <ErrorMessage class="invalid-feedback" name="email"></ErrorMessage>
          </div>
          <div class="mb-2">
            <label for="ContactAddress" class="text-muted mb-0"
              >地址<span class="text-danger fw-bold">*</span></label
            >
            <VField
              type="text"
              class="form-control"
              id="ContactAddress"
              name="地址"
              :class="{ 'is-invalid': errors['地址'] }"
              placeholder="請輸入地址"
              rules="required"
              v-model="user.address"
            />
            <ErrorMessage class="invalid-feedback" name="地址"></ErrorMessage>
          </div>
          <div class="mb-2">
            <label for="ContactName" class="text-muted mb-0"
              >姓名<span class="text-danger fw-bold">*</span></label
            >
            <VField
              type="text"
              class="form-control"
              id="ContactName"
              placeholder="請輸入姓名"
              name="姓名"
              rules="required"
              :class="{ 'is-invalid': errors['姓名'] }"
              v-model="user.name"
            />
            <ErrorMessage class="invalid-feedback" name="姓名"></ErrorMessage>
          </div>
          <div class="mb-2">
            <label for="ContactPhone" class="text-muted mb-0"
              >電話<span class="text-danger fw-bold">*</span></label
            >
            <VField
              type="text"
              class="form-control"
              id="ContactPhone"
              name="電話"
              :class="{ 'is-invalid': errors['電話'] }"
              placeholder="請輸入電話"
              :rules="isPhone"
              v-model="user.tel"
            />
            <ErrorMessage class="invalid-feedback" name="電話"></ErrorMessage>
          </div>
          <div class="mb-2">
            <label for="ContactMessage" class="text-muted mb-0">備註</label>
            <textarea
              class="form-control"
              rows="3"
              id="ContactMessage"
              v-model="message"
            ></textarea>
          </div>
          <div>
            <p class="m-0">
              付款方式<span class="text-danger fw-bold">*</span>
            </p>
            <div class="accordion" id="accordionExample">
              <div class="card rounded-0">
                <div
                  class="card-header bg-white border-0 py-3"
                  id="headingOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <p
                    class="mb-0 position-relative custom-checkout-label"
                    @click.self="payToggle(false)"
                    :class="isClickPay ? '' : 'show'"
                  >
                    現金付款
                  </p>
                </div>
              </div>
              <div class="card rounded-0">
                <div
                  class="card-header bg-white border-0 py-3"
                  id="headingTwo"
                  aria-expanded="true"
                  aria-controls="collapseTwo"
                >
                  <p
                    class="mb-0 position-relative custom-checkout-label"
                    @click.self="payToggle(true)"
                    :class="isClickPay ? 'show' : ''"
                  >
                    信用卡付款
                  </p>
                </div>

                <template v-if="isClickPay">
                  <div class="card-body bg-light py-4">
                    <div class="mb-2">
                      <label for="Lorem ipsum2" class="text-muted mb-0"
                        >選擇銀行</label
                      >
                      <VField
                        id="bank"
                        name="銀行"
                        class="form-control"
                        :class="{ 'is-invalid': errors['銀行'] }"
                        rules="required"
                        v-model="bankContent"
                        as="select"
                      >
                        <option selected value="4 臺灣銀行國際金融業務分行">
                          4 臺灣銀行國際金融業務分行
                        </option>
                        <option
                          v-for="item in bankList"
                          :key="item"
                          :value="item"
                        >
                          {{ item["總行代號"] }} {{ item["銀行別"] }}
                        </option>
                      </VField>
                    </div>
                    <div class="mb-2">
                      <p class="m-0">信用卡號</p>
                      <div class="row row-cols-2 row-cols-md-4 g-2">
                        <div
                          class="col"
                          v-for="(item, index) in text"
                          :key="`${item}${index}`"
                        >
                          <VField
                            type="text"
                            class="form-control"
                            :class="{
                              'is-invalid': errors[`信用卡號${index}`],
                            }"
                            :name="`信用卡號${index}`"
                            placeholder="請輸入信用卡號"
                            rules="required|numeric|length:4"
                            maxlength="4"
                            :value="text[`${index}`]"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="mb-2">
                      <p class="m-0">信用卡時間</p>
                      <div class="input-group mb-3">
                        <VField
                          type="text"
                          name="時間1"
                          placeholder="請輸入時間"
                          rules="required|numeric|length:2"
                          :class="{ 'is-invalid': errors['時間1'] }"
                          class="form-control rounded"
                          maxlength="2"
                          v-model="date[0]"
                        />
                        <span class="input-group-text bg-light border-0"
                          >/</span
                        >
                        <VField
                          type="text"
                          name="時間2"
                          placeholder="請輸入時間"
                          rules="required|numeric|length:2"
                          :class="{ 'is-invalid': errors['時間2'] }"
                          class="form-control rounded"
                          maxlength="2"
                          v-model="date[1]"
                        />
                      </div>
                    </div>
                    <div class="mb-0">
                      <p class="m-0">信用卡安全碼</p>
                      <VField
                        name="安全碼"
                        type="text"
                        placeholder="請輸入安全碼"
                        class="form-control"
                        :class="{ 'is-invalid': errors['安全碼'] }"
                        rules="required|numeric|length:3"
                        maxlength="3"
                        v-model="code"
                      />
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div
            class="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100"
          >
            <router-link :to="{ name: 'cart' }" class="text-dark mt-md-0 mt-3"
              ><i class="fas fa-chevron-left me-2"></i> 上一步</router-link
            >
            <button type="submit" class="btn btn-dark py-3 px-7">
              確認付款
            </button>
          </div>
        </VForm>
      </div>
    </div>
  </main>
  <FooterComponent />
</template>
