<script setup>
import gsap from 'gsap'
import { onMounted } from 'vue'

import loadingStore from '@/stores/loadingStore.js'
import { storeToRefs } from 'pinia'

const store = loadingStore()
const { isLoading } = storeToRefs(store)

function getGsap () {
  const tl = gsap.timeline({ repeat: -1 })

  const gsapDOM = document.querySelectorAll('.gsap-loading')
  gsapDOM.forEach((item, index) => {
    tl.to(
      item,
      { y: -50, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.out' },
      '-=75%'
    )
  })
}

onMounted(() => {
  getGsap()
})
</script>

<template>
  <VLoading
    :active="isLoading"
    :is-full-page="true"
    :background-color="'#111'"
    :color="'#fff'"
    :lock-scroll="true"
    :opacity="0.9"
  >
    <div class="d-flex align-items-center justify-content-center">
      <i class="fas fa-tint fs-3 text-light m-2 gsap-loading" />
      <i class="fas fa-tint fs-3 text-light m-2 gsap-loading" />
      <i class="fas fa-tint fs-3 text-light m-2 gsap-loading" />
    </div>
  </VLoading>
</template>
