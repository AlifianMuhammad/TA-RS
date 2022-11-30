import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import Row from "primevue/row"; //optional for row
import Toolbar from "primevue/toolbar";
import FileUpload from "primevue/fileupload";
import Toast from "primevue/toast";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Card from "primevue/card";

import PrimeVue from "primevue/config";

const app = createApp(App);

import "primevue/resources/themes/bootstrap4-light-blue/theme.css";

app.use(PrimeVue);
app.use(store);
app.use(router);

app.component("Button", Button);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Dropdown", Dropdown);

app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);
app.component("Toolbar", Toolbar);
app.component("FileUpload", FileUpload);
app.component("Toast", Toast);
app.component("InputText", InputText);
app.component("Card", Card);

app.mount("#app");
