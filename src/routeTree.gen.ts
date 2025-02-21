/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardImport } from './routes/dashboard'
import { Route as ProductsListImport } from './routes/products/list'
import { Route as ProductsIdImport } from './routes/products/$id'
import { Route as AdminMaterialsIndexImport } from './routes/admin/materials/index'
import { Route as ProductsStepsUploadFileImport } from './routes/products/steps/upload-file'
import { Route as ProductsImportsListImport } from './routes/products/imports/list'
import { Route as AdminMaterialsIdImport } from './routes/admin/materials/$id'

// Create Virtual Routes

const SettingsLazyImport = createFileRoute('/settings')()
const AboutLazyImport = createFileRoute('/about')()

// Create/Update Routes

const SettingsLazyRoute = SettingsLazyImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/settings.lazy').then((d) => d.Route))

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const DashboardRoute = DashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const ProductsListRoute = ProductsListImport.update({
  id: '/products/list',
  path: '/products/list',
  getParentRoute: () => rootRoute,
} as any)

const ProductsIdRoute = ProductsIdImport.update({
  id: '/products/$id',
  path: '/products/$id',
  getParentRoute: () => rootRoute,
} as any)

const AdminMaterialsIndexRoute = AdminMaterialsIndexImport.update({
  id: '/admin/materials/',
  path: '/admin/materials/',
  getParentRoute: () => rootRoute,
} as any)

const ProductsStepsUploadFileRoute = ProductsStepsUploadFileImport.update({
  id: '/products/steps/upload-file',
  path: '/products/steps/upload-file',
  getParentRoute: () => rootRoute,
} as any)

const ProductsImportsListRoute = ProductsImportsListImport.update({
  id: '/products/imports/list',
  path: '/products/imports/list',
  getParentRoute: () => rootRoute,
} as any)

const AdminMaterialsIdRoute = AdminMaterialsIdImport.update({
  id: '/admin/materials/$id',
  path: '/admin/materials/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsLazyImport
      parentRoute: typeof rootRoute
    }
    '/products/$id': {
      id: '/products/$id'
      path: '/products/$id'
      fullPath: '/products/$id'
      preLoaderRoute: typeof ProductsIdImport
      parentRoute: typeof rootRoute
    }
    '/products/list': {
      id: '/products/list'
      path: '/products/list'
      fullPath: '/products/list'
      preLoaderRoute: typeof ProductsListImport
      parentRoute: typeof rootRoute
    }
    '/admin/materials/$id': {
      id: '/admin/materials/$id'
      path: '/admin/materials/$id'
      fullPath: '/admin/materials/$id'
      preLoaderRoute: typeof AdminMaterialsIdImport
      parentRoute: typeof rootRoute
    }
    '/products/imports/list': {
      id: '/products/imports/list'
      path: '/products/imports/list'
      fullPath: '/products/imports/list'
      preLoaderRoute: typeof ProductsImportsListImport
      parentRoute: typeof rootRoute
    }
    '/products/steps/upload-file': {
      id: '/products/steps/upload-file'
      path: '/products/steps/upload-file'
      fullPath: '/products/steps/upload-file'
      preLoaderRoute: typeof ProductsStepsUploadFileImport
      parentRoute: typeof rootRoute
    }
    '/admin/materials/': {
      id: '/admin/materials/'
      path: '/admin/materials'
      fullPath: '/admin/materials'
      preLoaderRoute: typeof AdminMaterialsIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/dashboard': typeof DashboardRoute
  '/about': typeof AboutLazyRoute
  '/settings': typeof SettingsLazyRoute
  '/products/$id': typeof ProductsIdRoute
  '/products/list': typeof ProductsListRoute
  '/admin/materials/$id': typeof AdminMaterialsIdRoute
  '/products/imports/list': typeof ProductsImportsListRoute
  '/products/steps/upload-file': typeof ProductsStepsUploadFileRoute
  '/admin/materials': typeof AdminMaterialsIndexRoute
}

export interface FileRoutesByTo {
  '/dashboard': typeof DashboardRoute
  '/about': typeof AboutLazyRoute
  '/settings': typeof SettingsLazyRoute
  '/products/$id': typeof ProductsIdRoute
  '/products/list': typeof ProductsListRoute
  '/admin/materials/$id': typeof AdminMaterialsIdRoute
  '/products/imports/list': typeof ProductsImportsListRoute
  '/products/steps/upload-file': typeof ProductsStepsUploadFileRoute
  '/admin/materials': typeof AdminMaterialsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/dashboard': typeof DashboardRoute
  '/about': typeof AboutLazyRoute
  '/settings': typeof SettingsLazyRoute
  '/products/$id': typeof ProductsIdRoute
  '/products/list': typeof ProductsListRoute
  '/admin/materials/$id': typeof AdminMaterialsIdRoute
  '/products/imports/list': typeof ProductsImportsListRoute
  '/products/steps/upload-file': typeof ProductsStepsUploadFileRoute
  '/admin/materials/': typeof AdminMaterialsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/dashboard'
    | '/about'
    | '/settings'
    | '/products/$id'
    | '/products/list'
    | '/admin/materials/$id'
    | '/products/imports/list'
    | '/products/steps/upload-file'
    | '/admin/materials'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/dashboard'
    | '/about'
    | '/settings'
    | '/products/$id'
    | '/products/list'
    | '/admin/materials/$id'
    | '/products/imports/list'
    | '/products/steps/upload-file'
    | '/admin/materials'
  id:
    | '__root__'
    | '/dashboard'
    | '/about'
    | '/settings'
    | '/products/$id'
    | '/products/list'
    | '/admin/materials/$id'
    | '/products/imports/list'
    | '/products/steps/upload-file'
    | '/admin/materials/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  DashboardRoute: typeof DashboardRoute
  AboutLazyRoute: typeof AboutLazyRoute
  SettingsLazyRoute: typeof SettingsLazyRoute
  ProductsIdRoute: typeof ProductsIdRoute
  ProductsListRoute: typeof ProductsListRoute
  AdminMaterialsIdRoute: typeof AdminMaterialsIdRoute
  ProductsImportsListRoute: typeof ProductsImportsListRoute
  ProductsStepsUploadFileRoute: typeof ProductsStepsUploadFileRoute
  AdminMaterialsIndexRoute: typeof AdminMaterialsIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  DashboardRoute: DashboardRoute,
  AboutLazyRoute: AboutLazyRoute,
  SettingsLazyRoute: SettingsLazyRoute,
  ProductsIdRoute: ProductsIdRoute,
  ProductsListRoute: ProductsListRoute,
  AdminMaterialsIdRoute: AdminMaterialsIdRoute,
  ProductsImportsListRoute: ProductsImportsListRoute,
  ProductsStepsUploadFileRoute: ProductsStepsUploadFileRoute,
  AdminMaterialsIndexRoute: AdminMaterialsIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/dashboard",
        "/about",
        "/settings",
        "/products/$id",
        "/products/list",
        "/admin/materials/$id",
        "/products/imports/list",
        "/products/steps/upload-file",
        "/admin/materials/"
      ]
    },
    "/dashboard": {
      "filePath": "dashboard.tsx"
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/settings": {
      "filePath": "settings.lazy.tsx"
    },
    "/products/$id": {
      "filePath": "products/$id.tsx"
    },
    "/products/list": {
      "filePath": "products/list.tsx"
    },
    "/admin/materials/$id": {
      "filePath": "admin/materials/$id.tsx"
    },
    "/products/imports/list": {
      "filePath": "products/imports/list.tsx"
    },
    "/products/steps/upload-file": {
      "filePath": "products/steps/upload-file.tsx"
    },
    "/admin/materials/": {
      "filePath": "admin/materials/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
