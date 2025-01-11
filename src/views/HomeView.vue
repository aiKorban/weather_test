<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city for state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1;x_0_0_#004E71]"
      />
      <ul
        v-if="mapboxSearchResults"
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
      >
        <p v-if="searchError">Sorry something went wrong. Try again later</p>
        <p v-if="!searchError && mapboxSearchResults.length === 0">
          No result match your query, try a different term.
        </p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            @click="previewCity(searchResult)"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
          >
            {{ searchResult.properties.full_address }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <p><CityCardSkeleton /></p>
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import CityCardSkeleton from '../components/CityCardSkeleton.vue'
import CityList from "../components/CityList.vue"
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);
const searchError = ref(null);
const mapboxAPIKey = "pk.eyJ1IjoicGhlYXJvbTE2OCIsImEiOiJjbTVuYWd0em4wOTFsMm1xNXdyMnV6aXo4In0.JVmV2ZGYWG7oNbxDE3Zi4w";
const router = useRouter();

const previewCity = async (searchResult) => {

  console.log(searchResult)

  const [city, state] = searchResult.properties.full_address.split(",");

  await router.push({
    name: "cityView",
    params: { state: state.replace(" ",""), city: city.replace(" ","") },
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true
    }
  });
};

const getSearchResults = async () => {

  clearTimeout(queryTimeout.value);

  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/search/geocode/v6/forward?q=${searchQuery.value}&access_token=${mapboxAPIKey}&types=place`
        );
        mapboxSearchResults.value = result.data.features
        console.log(mapboxSearchResults.value)
        return mapboxSearchResults.value;
      } catch {
        searchError.value = true;
      }
      return;
    }
    mapboxSearchResults.value = null;
  }, 300);


};
</script>
