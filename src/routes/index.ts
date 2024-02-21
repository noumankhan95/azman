import { lazy } from 'react';
const UserContracts = lazy(() => import('../pages/User_Contracts'));

const Settings = lazy(() => import('../pages/Settings'));

const AddUsers = lazy(() => import('../pages/AddUsers'));
const UserDetails = lazy(() => import('../pages/UserDetails'));
const Contracts = lazy(() => import('../pages/Contracts'));
const AddContract = lazy(() => import('../pages/AddContract'));
const ListadminUsers = lazy(() => import('../pages/ListAdminUsers'));
const UserContractDetails = lazy(() => import('../pages/UserContractDetail'));
const NewUsers = lazy(() => import('../pages/NewUsers'));
const ApprovedUsers = lazy(() => import('../pages/ApprovedUsers'));

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
    path: '/userDetails',
    title: 'User Details',
    component: UserDetails,
  },

  {
    path: '/addUsers',
    title: 'Staff',
    component: AddUsers,
  },

  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
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
    path: '/newUsers',
    title: 'New Users',
    component: NewUsers,
  },
  {
    path: '/approvedUsers',
    title: 'Approved Users',
    component: ApprovedUsers,
  },
];

const routes = [...coreRoutes];
export default routes;
