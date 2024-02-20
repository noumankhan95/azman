import { lazy } from 'react';
const UserContracts = lazy(() => import('../pages/User_Contracts'));

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const AddUsers = lazy(() => import('../pages/AddUsers'));
const ListUsers = lazy(() => import('../pages/ListUsers'));
const UserDetails = lazy(() => import('../pages/UserDetails'));
const Contracts = lazy(() => import('../pages/Contracts'));
const AddContract = lazy(() => import('../pages/AddContract'));
const ListadminUsers = lazy(() => import('../pages/ListAdminUsers'));
const UserContractDetails = lazy(() => import('../pages/UserContractDetail'));
const FilterUsers = lazy(() => import('../pages/FilterUsers'));

const coreRoutes = [
  {
    path: '/listadminUsers',
    title: 'List Admin Users',
    component: ListadminUsers,
  },
  {
    path: '/addContract',
    title: 'Add Contracts',
    component: AddContract,
  },
  {
    path: '/contracts',
    title: 'Contracts',
    component: Contracts,
  },
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/userDetails',
    title: 'User Details',
    component: UserDetails,
  },
  {
    path: '/listUsers',
    title: 'List Users',
    component: ListUsers,
  },
  {
    path: '/addUsers',
    title: 'Staff',
    component: AddUsers,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
  {
    path: '/userContracts',
    title: 'User Contracts',
    component: UserContracts,
  },
  {
    path: '/userContractDetails',
    title: 'User Contract Details',
    component: UserContractDetails,
  },
  {
    path: '/filterUsers',
    title: 'Filter Users',
    component: FilterUsers,
  },
];

const routes = [...coreRoutes];
export default routes;
