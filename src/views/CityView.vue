<template>
  <div>
    <Suspense>
      <template #fallback> <CityViewSkeleton /> </template>
      <AsyncCityView />
    </Suspense>
  </div>
</template>


<script setup>
import CityViewSkeleton from "../components/CityViewSkeleton.vue"
import AsyncCityView from "../components/AsyncCityView.vue";
</script>