
const routes = [
  {
    path: '/',
    component: () => import('layouts/Rappid.vue'),
    redirect: '/welcome',
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('src/pages/Welcome.vue'),
        meta: { title: 'welcome', auth: true, role: 'basic' }
      },
      // {
      //   path: 'users',
      //   component: () => import('layouts/EmptyComponent.vue'),
      //   meta: { label: 'users', auth: true, role: 'admin' },
      //   children: [
      //     {
      //       path: '',
      //       name: 'users',
      //       component: () => import('pages/admin/users/Users.vue'),
      //       meta: { title: 'users', label: 'users', auth: true, role: 'admin' }
      //     },
      //     {
      //       path: 'create',
      //       name: 'createUser',
      //       component: () => import('pages/admin/users/UsersCreate.vue'),
      //       meta: { title: 'createUser', label: 'createUser', auth: true, role: 'admin' }
      //     }
      //   ]
      // },
      {
        path: 'rappid',
        component: () => import('layouts/EmptyComponent.vue'),
        meta: { title: 'rappid', auth: true },
        children: [
          {
            path: '',
            name: 'rappid',
            component: () => import('src/pages/rappid/RappidOptions.vue'),
            meta: { title: 'rappid', auth: true }
          },
          {
            path: 'search',
            name: 'search',
            component: () => import('src/pages/rappid/search/Search.vue'),
            meta: { title: 'search', auth: true }
          },
          {
            path: 'rappidorders',
            name: 'rappidorders',
            component: () => import('src/pages/rappid/orders/Orders.vue'),
            meta: { title: 'rappidorders', auth: true }
          },
          {
            path: 'cart',
            name: 'cart',
            component: () => import('src/pages/rappid/order/Cart.vue'),
            meta: { title: 'cart', auth: true }
          },
          {
            path: 'favourites',
            component: () => import('layouts/EmptyComponent.vue'),
            meta: { title: 'favourites', auth: true },
            children: [
              {
                path: '',
                name: 'favourites',
                component: () => import('src/pages/rappid/order/Favourites.vue'),
                meta: { title: 'favourites', label: 'favourites', auth: true }
              },
              {
                path: 'favourite/:pk',
                props: true,
                name: 'favourite',
                component: () => import('src/pages/rappid/order/Favourite.vue'),
                meta: { title: 'favourite', label: 'favourite', auth: true }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/Index.vue'),
        meta: { title: 'stock', auth: true, role: 'basic' }
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: () => import('pages/inventory/Inventory.vue'),
        meta: { title: 'inventory', label: 'inventory', auth: true }
      },
      {
        path: 'bulk',
        name: 'bulk',
        component: () => import('pages/inventory/Bulk.vue'),
        meta: { title: 'bulk', label: 'bulk', auth: true }
      },
      {
        path: 'stocktake',
        name: 'stocktake',
        component: () => import('pages/inventory/Stocktake.vue'),
        meta: { title: 'stocktake', label: 'stocktake', auth: true }
      },
      {
        path: 'orders',
        component: () => import('layouts/EmptyComponent.vue'),
        meta: { label: 'orders', auth: true },
        children: [
          {
            path: '',
            name: 'orders',
            component: () => import('pages/order/Orders.vue'),
            meta: { title: 'orders', label: 'orders', auth: true }
          },
          {
            path: 'create',
            name: 'create',
            component: () => import('pages/order/Order.vue'),
            meta: { title: 'create', label: 'create', auth: true }
          },
          {
            path: 'receive/:pk',
            props: true,
            name: 'receive',
            component: () => import('pages/order/Receive.vue'),
            meta: { title: 'receive', label: 'receive', auth: true }
          }
        ]
      },
      {
        path: 'template',
        component: () => import('layouts/EmptyComponent.vue'),
        meta: { label: 'template', auth: true },
        children: [
          {
            path: '',
            name: 'template',
            component: () => import('pages/template/Template.vue'),
            meta: { title: 'template', label: 'template', auth: true }
          },
          {
            path: 'create',
            name: 'createTemplate',
            component: () => import('pages/template/TemplateCreate.vue'),
            meta: { title: 'createTemplate', label: 'createTemplate', auth: true }
          },
          {
            path: 'edit/:pk',
            props: true,
            name: 'editTemplate',
            component: () => import('pages/template/TemplateEdit.vue'),
            meta: { title: 'editTemplate', label: 'editTemplate', auth: true }
          },
          {
            path: 'view/:pk',
            props: true,
            name: 'viewTemplate',
            component: () => import('pages/template/TemplateView.vue'),
            meta: { title: 'viewTemplate', label: 'viewTemplate', auth: true }
          }
        ]
      },
      {
        path: 'admin',
        component: () => import('layouts/EmptyComponent.vue'),
        meta: { label: 'admin', auth: true, role: 'admin' },
        children: [
          {
            path: '',
            name: 'admin',
            component: () => import('pages/admin/Admin.vue'),
            meta: { title: 'admin', label: 'admin', auth: true, role: 'admin' }
          },
          {
            path: 'transactions',
            name: 'transactions',
            component: () => import('pages/admin/transactions/Transactions.vue'),
            meta: { title: 'transactions', label: 'transactions', auth: true, role: 'admin' }
          },
          {
            path: 'stocktakes',
            component: () => import('layouts/EmptyComponent.vue'),
            meta: { label: 'stocktakes', auth: true, role: 'admin' },
            children: [
              {
                path: '',
                name: 'stocktakes',
                component: () => import('pages/admin/stocktake/Stocktakes.vue'),
                meta: { title: 'stocktakes', label: 'stocktakes', auth: true, role: 'admin' }
              },
              {
                path: 'viewstocktake/:pk',
                props: true,
                name: 'viewstocktake',
                component: () => import('pages/admin/stocktake/Stocktake.vue'),
                meta: { title: 'viewstocktake', label: 'viewstocktake', auth: true, role: 'admin' }
              }
            ]
          },
          {
            path: 'users',
            component: () => import('layouts/EmptyComponent.vue'),
            meta: { label: 'users', auth: true, role: 'admin' },
            children: [
              {
                path: '',
                name: 'users',
                component: () => import('pages/admin/users/Users.vue'),
                meta: { title: 'users', label: 'users', auth: true, role: 'admin' }
              },
              {
                path: 'create',
                name: 'createUser',
                component: () => import('pages/admin/users/UsersCreate.vue'),
                meta: { title: 'createUser', label: 'createUser', auth: true, role: 'admin' }
              }
            ]
          },
          {
            path: 'locations',
            component: () => import('layouts/EmptyComponent.vue'),
            meta: { label: 'locations', auth: true, role: 'admin' },
            children: [
              {
                path: '',
                name: 'locations',
                component: () => import('pages/admin/location/Locations.vue'),
                meta: { title: 'locations', label: 'locations', auth: true, role: 'admin' }
              },
              {
                path: 'create',
                name: 'createLocation',
                component: () => import('pages/admin/location/LocationCreate.vue'),
                meta: { title: 'createLocation', label: 'createLocation', auth: true, role: 'admin' }
              },
              {
                path: 'edit/:pk',
                props: true,
                name: 'editLocation',
                component: () => import('pages/admin/location/LocationEdit.vue'),
                meta: { title: 'editLocation', label: 'editLocation', auth: true, role: 'admin' }
              }
            ]
          },
          {
            path: 'maps',
            component: () => import('layouts/EmptyComponent.vue'),
            meta: { label: 'maps', auth: true, role: 'admin' },
            children: [
              {
                path: '',
                name: 'maps',
                component: () => import('pages/admin/map/Maps.vue'),
                meta: { title: 'maps', label: 'maps', auth: true, role: 'admin' }
              },
              {
                path: 'create',
                name: 'createMap',
                component: () => import('pages/admin/map/MapCreate.vue'),
                meta: { title: 'createMap', label: 'createMap', auth: true, role: 'admin' }
              },
              {
                path: 'edit/:pk',
                props: true,
                name: 'editMap',
                component: () => import('pages/admin/map/MapEdit.vue'),
                meta: { title: 'editMap', label: 'editMap', auth: true, role: 'admin' }
              }
            ]
          },
          {
            path: 'supply',
            component: () => import('layouts/EmptyComponent.vue'),
            meta: { label: 'supply', auth: true, role: 'admin' },
            children: [
              {
                path: '',
                name: 'supply',
                component: () => import('pages/admin/supply/Supply.vue'),
                meta: { title: 'supply', label: 'supply', auth: true, role: 'admin' }
              },
              {
                path: 'create',
                name: 'createSupply',
                component: () => import('pages/admin/supply/SupplyCreate.vue'),
                meta: { title: 'createSupply', label: 'createSupply', auth: true, role: 'admin' }
              },
              {
                path: 'edit/:pk',
                props: true,
                name: 'editSupply',
                component: () => import('pages/admin/supply/SupplyEdit.vue'),
                meta: { title: 'editSupply', label: 'editSupply', auth: true, role: 'admin' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('pages/auth/Auth.vue'),
    meta: { title: 'Authenticator', auth: false }
  },
  {
    path: '/reset',
    name: 'reset',
    component: () => import('pages/auth/Reset.vue'),
    meta: { title: 'Authenticator', auth: false }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
