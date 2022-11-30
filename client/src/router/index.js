import { createRouter, createWebHistory } from "vue-router";
import Admin from "../views/Admin.vue";
import AddDokter from "../views/AddDokter.vue";
import EditDokter from "../views/EditDokter.vue";
import WebgisRS from "../views/WebgisRS.vue";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "WebgisRS",
    component: WebgisRS,
  },
  {
    path: "/add-dokter",
    name: "AddDokter",
    component: AddDokter,
  },
  {
    path: "/edit-dokter/:id",
    name: "EditDokter",
    component: EditDokter,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
