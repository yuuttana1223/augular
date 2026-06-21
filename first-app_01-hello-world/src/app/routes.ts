import type { Routes } from "@angular/router";
import { Details } from "src/app/details/details";
import { Home } from "src/app/home/home";

const routeConfig: Routes = [
  {
    path: "",
    component: Home,
    title: "Home page",
  },
  {
    path: "details/:id",
    component: Details,
    title: "Home details",
  },
];

export default routeConfig;
