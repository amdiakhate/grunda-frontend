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
import { Route as ProductsImportsListImport } from './routes/products/imports/list'

// Create Virtual Routes

const SettingsLazyImport = createFileRoute('/settings')()
const AboutLazyImport = createFileRoute('/about')()
const ProductsStepsUploadFileLazyImport = createFileRoute(
  '/products/steps/upload-file',
)()
const ProductsStepsPreviewLazyImport = createFileRoute(
  '/products/steps/preview',
)()

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

const ProductsStepsUploadFileLazyRoute =
  ProductsStepsUploadFileLazyImport.update({
    id: '/products/steps/upload-file',
    path: '/products/steps/upload-file',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/products/steps/upload-file.lazy').then((d) => d.Route),
  )

const ProductsStepsPreviewLazyRoute = ProductsStepsPreviewLazyImport.update({
  id: '/products/steps/preview',
  path: '/products/steps/preview',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/products/steps/preview.lazy').then((d) => d.Route),
)

const ProductsImportsListRoute = ProductsImportsListImport.update({
  id: '/products/imports/list',
  path: '/products/imports/list',
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
    '/products/imports/list': {
      id: '/products/imports/list'
      path: '/products/imports/list'
      fullPath: '/products/imports/list'
      preLoaderRoute: typeof ProductsImportsListImport
      parentRoute: typeof rootRoute
    }
    '/products/steps/preview': {
      id: '/products/steps/preview'
      path: '/products/steps/preview'
      fullPath: '/products/steps/preview'
      preLoaderRoute: typeof ProductsStepsPreviewLazyImport
      parentRoute: typeof rootRoute
    }
    '/products/steps/upload-file': {
      id: '/products/steps/upload-file'
      path: '/products/steps/upload-file'
      fullPath: '/products/steps/upload-file'
      preLoaderRoute: typeof ProductsStepsUploadFileLazyImport
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
  '/products/imports/list': typeof ProductsImportsListRoute
  '/products/steps/preview': typeof ProductsStepsPreviewLazyRoute
  '/products/steps/upload-file': typeof ProductsStepsUploadFileLazyRoute
}

export interface FileRoutesByTo {
  '/dashboard': typeof DashboardRoute
  '/about': typeof AboutLazyRoute
  '/settings': typeof SettingsLazyRoute
  '/products/$id': typeof ProductsIdRoute
  '/products/list': typeof ProductsListRoute
  '/products/imports/list': typeof ProductsImportsListRoute
  '/products/steps/preview': typeof ProductsStepsPreviewLazyRoute
  '/products/steps/upload-file': typeof ProductsStepsUploadFileLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/dashboard': typeof DashboardRoute
  '/about': typeof AboutLazyRoute
  '/settings': typeof SettingsLazyRoute
  '/products/$id': typeof ProductsIdRoute
  '/products/list': typeof ProductsListRoute
  '/products/imports/list': typeof ProductsImportsListRoute
  '/products/steps/preview': typeof ProductsStepsPreviewLazyRoute
  '/products/steps/upload-file': typeof ProductsStepsUploadFileLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/dashboard'
    | '/about'
    | '/settings'
    | '/products/$id'
    | '/products/list'
    | '/products/imports/list'
    | '/products/steps/preview'
    | '/products/steps/upload-file'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/dashboard'
    | '/about'
    | '/settings'
    | '/products/$id'
    | '/products/list'
    | '/products/imports/list'
    | '/products/steps/preview'
    | '/products/steps/upload-file'
  id:
    | '__root__'
    | '/dashboard'
    | '/about'
    | '/settings'
    | '/products/$id'
    | '/products/list'
    | '/products/imports/list'
    | '/products/steps/preview'
    | '/products/steps/upload-file'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  DashboardRoute: typeof DashboardRoute
  AboutLazyRoute: typeof AboutLazyRoute
  SettingsLazyRoute: typeof SettingsLazyRoute
  ProductsIdRoute: typeof ProductsIdRoute
  ProductsListRoute: typeof ProductsListRoute
  ProductsImportsListRoute: typeof ProductsImportsListRoute
  ProductsStepsPreviewLazyRoute: typeof ProductsStepsPreviewLazyRoute
  ProductsStepsUploadFileLazyRoute: typeof ProductsStepsUploadFileLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  DashboardRoute: DashboardRoute,
  AboutLazyRoute: AboutLazyRoute,
  SettingsLazyRoute: SettingsLazyRoute,
  ProductsIdRoute: ProductsIdRoute,
  ProductsListRoute: ProductsListRoute,
  ProductsImportsListRoute: ProductsImportsListRoute,
  ProductsStepsPreviewLazyRoute: ProductsStepsPreviewLazyRoute,
  ProductsStepsUploadFileLazyRoute: ProductsStepsUploadFileLazyRoute,
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
        "/products/imports/list",
        "/products/steps/preview",
        "/products/steps/upload-file"
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
    "/products/imports/list": {
      "filePath": "products/imports/list.tsx"
    },
    "/products/steps/preview": {
      "filePath": "products/steps/preview.lazy.tsx"
    },
    "/products/steps/upload-file": {
      "filePath": "products/steps/upload-file.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
