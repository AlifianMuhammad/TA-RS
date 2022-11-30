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
        <div class="card-header">Add a New Dokter</div>
        <div class="card-body">
          <form @submit.prevent="addNewDokter()">
            <!-- FORM NAMA DOKTER -->
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
              Add New Dokter
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const spesialisList = ref([]);
    const rumahSakitList = ref([]);

    onMounted(() => {
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

    const newDokter = reactive({
      nama_dokter: "",
      smid: "",
      spesialis_id: "",
    });

    const router = useRouter();

    function addNewDokter() {
      axios
        .post(
          `http://localhost:3009/api/v1/rumahsakit/tambah-dokter`,
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
      addNewDokter,
      router,
      newDokter,
      spesialisList,
      rumahSakitList,
    };
  },
};
</script>

<style></style>
