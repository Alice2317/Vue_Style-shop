<script setup>
import { ref } from 'vue'
import { alert } from '@/assets/js/swal.js'

// 訂閱
const email = ref(null)
function emailSubmit () {
  const { value } = email
  alert('success', `已傳送至${value}`)
}

// 滾動行為
function scrollTop () {
  window.scroll({
    top: 0
  })
}
</script>

<template>
  <div class="bg-light py-4">
    <div class="container">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start"
      >
        <p class="mb-0 fw-bold">馬上訂閱我們的電子報，優先得到最新活動。</p>
        <VForm @submit="emailSubmit" class="w-md-50" v-slot="{ errors }">
          <ErrorMessage class="text-danger" name="email" />
          <div class="input-group">
            <VField
              name="email"
              type="email"
              rules="required|email"
              class="form-control"
              :class="{ 'is-invalid': errors['email'] }"
              placeholder="請輸入EMAIL"
              v-model="email"
            />
            <button class="btn btn-dark" type="submit" id="button-addon2">
              訂閱
            </button>
          </div>
        </VForm>
      </div>
    </div>
  </div>
  <div class="bg-dark py-5">
    <div class="container">
      <div
        class="d-flex align-items-center justify-content-between text-white mb-md-7 mb-4"
      >
        <router-link
          class="text-white h4 text-decoration-none text-uppercase"
          to="/"
          >style</router-link
        >
        <ul class="d-flex list-unstyled mb-0 h4">
          <li>
            <a href="https://style.blogalice.store/" class="text-white mx-3"
              ><i class="fab fa-github"></i
            ></a>
          </li>
        </ul>
      </div>
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-md-end align-items-start text-white"
      >
        <div class="mb-md-0 mb-1">
          <p class="mb-0">0919346530</p>
          <p class="mb-0">onlyrong000@gmail.com</p>
        </div>
        <p class="mb-0 text-end">
          本網站僅作為求職作品集使用<br />不供商業用途
        </p>
      </div>
    </div>
  </div>

  <div class="position-fixed bottom-0 end-0 m-4">
    <div class="btn-group-vertical">
      <button
        type="button"
        class="btn btn-light mt-2 pt-2 pb-0"
        @click="scrollTop"
      >
        <i class="fas fa-sort-up"></i>
      </button>
    </div>
  </div>
</template>
