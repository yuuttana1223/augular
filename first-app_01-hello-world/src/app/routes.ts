import type { Routes } from "@angular/router";
import { Details } from "src/app/details/details";
import { Home } from "src/app/home/home";
import { DeleteDemoComponent } from "src/app/confirm-dialog/delete-demo";

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
  {
    path: "demo",
    component: DeleteDemoComponent,
    title: "Demo",
  },
];

export default routeConfig;
