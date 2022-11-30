<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-8">
        <router-link :to="{ name: 'Index' }">
          <button type="button" class="btn btn-primary mb-3">
            Back to Dashboard
          </button>
        </router-link>
      </div>

      <div class="card rounded shadow">
        <div class="card-header">Edit Dokter</div>
        <div class="card-body">
          <form @submit.prevent="editDokter()">
            <div class="mb-3">
              <span class="p-float-label">
                <InputText
                  id="username"
                  type="text"
                  v-model="newDokter.nama_dokter"
                  placeholder="Nama Dokter"
                />
              </span>

              <!-- DROPDOWN SPESIALIS -->
              <span>
                <Dropdown
                  v-model="newDokter.smid"
                  :options="rumahSakitList"
                  optionLabel="nama"
                  optionValue="smid"
                  placeholder="Select Rumah Sakit"
                />
              </span>
              <span>
                <Dropdown
                  v-model="newDokter.spesialis_id"
                  :options="spesialisList"
                  optionLabel="label"
                  optionValue="key"
                  placeholder="Select Spesialis"
                />
              </span>

              <button type="submit" class="btn btn-primary mb-3">
                Update Dokter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

export default {
  setup() {
    let newDokter = reactive({
      nama_dokter: "",
      smid: "",
      spesialis_id: "",
    });
    const spesialisList = ref([]);
    const rumahSakitList = ref([]);

    const router = useRouter();
    const route = useRoute();

    onMounted(() => {
      axios
        .get(`http://localhost:3009/api/v1/rumahsakit/${route.params.id}`)
        .then((result) => {
          console.log(result);
          newDokter.nama_dokter = result.data.currentDokter[0].nama_dokter;
          newDokter.smid = result.data.currentDokter[0].smid;
          newDokter.spesialis_id = result.data.currentDokter[0].spesialis_id;
          console.log(newDokter.nama_dokter);
        });
      axios.get("http://localhost:3009/api/v1/spesialis/all").then((result) => {
        spesialisList.value = result.data.spesialisAll;
        console.log(result.data);
      });

      axios
        .get("http://localhost:3009/api/v1/rumahsakit-nama-id/all")
        .then((result) => {
          rumahSakitList.value = result.data.rumahsakitNamaId;
          console.log(result.data);
        });
    });

    function editDokter() {
      axios
        .put(
          `http://localhost:3009/api/v1/rumahsakit/update-dokter/${route.params.id}`,
          newDokter
        )
        .then(() => {
          router
            .push({
              name: "Index",
            })
            .catch((err) => {
              console.log(err.message);
            });
        });
    }
    return {
      editDokter,
      router,
      newDokter,
      route,
      spesialisList,
      rumahSakitList,
    };
  },
};
</script>

<style></style>
