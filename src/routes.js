/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import LibraryBooks from "@material-ui/icons/LibraryBooks";

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Bodegas from "views/Bodegas/Bodegas.js";
import Warehouse from "views/Warehouse/Warehouse.js";
import Locations from "views/Racks/racks";

// core components/views for RTL layout
import Storage from "@material-ui/icons/Storage";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/bodegas",
    name: "Localizaciones",
    icon: LibraryBooks,
    component: Bodegas,
    layout: "/admin"
  },
  {
    path: "/warehouse",
    name: "Bodegas",
    icon: Storage,
    component: Warehouse,
    layout: "/admin"
  },
  {
    path: "/Racks",
    name: "Ubicaciones",
    icon: Storage,
    component: Locations,
    layout: "/admin"
  }
];

export default dashboardRoutes;
