<script setup>
const { pagination } = defineProps(['pagination'])
</script>

<template>
  <ul class="pagination justify-content-center align-items-center">
    <li class="page-item" :class="pagination?.has_pre ? 'd-block' : 'd-none'">
      <button
        class="page-link rounded-0"
        type="button"
        aria-label="Previous"
        @click="$emit('page', pagination?.current_page - 1)"
      >
        <span aria-hidden="true">&laquo;</span>
      </button>
    </li>
    <li
      class="page-item"
      :class="pagination?.current_page === item ? 'active' : ''"
      v-for="item in pagination?.total_pages"
      :key="'page' + item"
    >
      <button class="page-link rounded-0" href="#" @click="$emit('page', item)">
        {{ item }}
      </button>
    </li>

    <li class="page-item" :class="pagination?.has_next ? 'd-block' : 'd-none'">
      <button
        class="page-link rounded-0"
        type="button"
        aria-label="Next"
        @click="$emit('page', pagination?.current_page + 1)"
      >
        <span aria-hidden="true">&raquo;</span>
      </button>
    </li>
  </ul>
</template>
