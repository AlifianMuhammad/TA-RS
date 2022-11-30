<template>
  <div>
    <div>
      <Navbar />
    </div>
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-8">
          <router-link :to="{ name: 'AddDokter' }">
            <button type="button" class="btn btn-primary mb-3">
              Add Dokter
            </button>
          </router-link>
        </div>

        <DataTable
          :value="dataRumahSakit"
          dataKey="id"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :filters="filters"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          responsiveLayout="scroll"
        >
          <template #header>
            <div
              class="table-header flex flex-column md:flex-row md:justiify-content-between"
            >
              <h5 class="mb-2 md:m-0 p-as-md-center">Manage Dokter</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search..."
                />
              </span>
            </div>
          </template>

          <Column
            field="id"
            header="Dokter ID"
            :sortable="true"
            style="max-width: 7%"
          ></Column>
          <Column
            field="nama"
            header="Rumah Sakit"
            :sortable="true"
            style="min-width: 16rem"
          ></Column>

          <Column
            field="nama_spesialis"
            header="Spesialis"
            :sortable="true"
            style="min-width: 16rem"
          ></Column>
          <Column
            field="nama_dokter"
            header="Nama Dokter"
            :sortable="true"
            style="min-width: 16rem"
          ></Column>
          <Column header="Actions">
            <template #body="slotProps">
              <router-link
                :to="{ name: 'EditDokter', params: { id: slotProps.data.id } }"
              >
                <Button
                  icon="pi pi-pencil"
                  class="p-button-warning mr-2"
                ></Button>
              </router-link>
              <Button
                icon="pi pi-trash"
                class="p-button-danger"
                @click="destroy(slotProps.data.id)"
              >
              </Button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import axios from "axios";
import { onMounted, ref } from "vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import Navbar from "../components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  setup() {
    let dataRumahSakit = ref([]);
    const router = useRouter();
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    onMounted(() => {
      // GET DATA
      axios
        .get("http://localhost:3009/api/v1/rumahsakit/all/data")
        .then((result) => {
          dataRumahSakit.value = result.data.rumahsakitAll;
          console.log(dataRumahSakit);
        })
        .catch((err) => {
          console.log(err.response.message);
        });
    });

    function destroy(id) {
      axios
        .delete(`http://localhost:3009/api/v1/rumahsakit/delete-dokter/${id}`)
        .then(() => {})
        .catch((err) => {
          err.response.message;
        });
    }

    return {
      dataRumahSakit,
      destroy,
      router,
      filters,
    };
  },
};
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 960px) {
    align-items: start;
  }
}

.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 50px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media screen and (max-width: 960px) {
  ::v-deep(.p-toolbar) {
    flex-wrap: wrap;

    .p-button {
      margin-bottom: 0.25rem;
    }
  }
}
</style>
