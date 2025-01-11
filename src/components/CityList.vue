<template>
  <div v-for="city in saveCities" :key="city.id">
    <CityCard :city="city" @click="geToCityView(city)"/>
  </div>
  <p v-if="saveCities.length === 0">
    No Location added. To start tracking a location, search in the field above.
  </p>
</template>

<script setup>
import CityCard from "./CityCard.vue"
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
const saveCities = ref([]);

const getCities = async () => {
  if (localStorage.getItem("saveCities")) {
    saveCities.value = JSON.parse(localStorage.getItem("saveCities"));

    const requests = [];
    saveCities.value.forEach((city) => {
      requests.push(
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=ab9ffba82ec7ed4b627b345c57428271&units=imperial`
        )
      );
    });

    // we use promise.all for array promise, it mean that look at to the foreach, it render alot await(xios.get)
    // and we can not use promiss in foreach function
    const weatherData = await Promise.all(requests)

    weatherData.forEach((value, index) => {
      saveCities.value[index].weather = value.data;
    });
  }
};
await getCities()
const router = useRouter()
const geToCityView = (city) =>{
  router.push({
    name: "cityView",
    params: { state: city.state.replace(" ",""), city: city.city.replace(" ","") },
    query: {
      lat: city.coords.lat,
      lng: city.coords.lng,
      id: city.id
    }
  })
}
</script>