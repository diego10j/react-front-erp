import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const OverviewCoursePage = lazy(() => import('src/pages/dashboard/course'));
// Product
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// Blog
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// Job
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// Tour
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// App
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// Test render page by role
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// Blank page
const ParamsPage = lazy(() => import('src/pages/dashboard/params'));
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));


// ----ERP
// ======================= AUDITORIA
const EventosAuditoriaPage = lazy(() => import('src/pages/auditoria/eventos-audit-list'));
// ======================= SISTEMA
const Empresa = lazy(() => import('src/pages/sistema/Empresa'));
const SucursalPage = lazy(() => import('src/pages/sistema/sucursales'));
// Opciones
const OpcionListPage = lazy(() => import('src/pages/sistema/opciones/opcion-list'));
// Sistemas
const SistemaListPage = lazy(() => import('src/pages/sistema/sistema-list'));

// Usuarios
const UsuarioListPage = lazy(() => import('src/pages/sistema/usuarios/usuario-list'));
const UsuarioEditPage = lazy(() => import('src/pages/sistema/usuarios/usuario-edit'));
const UsuarioCreatePage = lazy(() => import('src/pages/sistema/usuarios/usuario-create'));

// ======================= SEGURIDAD
// Perfiles
const HorariosListPage = lazy(() => import('src/pages/seguridad/horarios-list'));
const TipoHorarioPage = lazy(() => import('src/pages/seguridad/tipo-horario'));
const PefilListPage = lazy(() => import('src/pages/seguridad/permisos/perfil-list'));
const PerfilOpcionPage = lazy(() => import('src/pages/seguridad/permisos/perfil-opcion'));

// ======================= INVENTARIO
// Productos
const CategoriasListPage = lazy(() => import('src/pages/inventario/productos/categorias-list'));
const ProductoListPage = lazy(() => import('src/pages/inventario/productos/producto-list'));
const ProductoCreatePage = lazy(() => import('src/pages/inventario/productos/producto-create'));
const ProductoEditPage = lazy(() => import('src/pages/inventario/productos/producto-edit'));
const ProductoDetailsPage = lazy(() => import('src/pages/inventario/productos/producto-details'));
// Bodegas
const BodegasListPage = lazy(() => import('src/pages/inventario/bodegas/bodegas-list'));
const MovimientosBodegaPage = lazy(() => import('src/pages/inventario/bodegas/movimientos'));
const BodegasCreatePage = lazy(() => import('src/pages/inventario/bodegas/bodegas-create'));
const BodegasEditPage = lazy(() => import('src/pages/inventario/bodegas/bodegas-edit'));
const StockProductosPage = lazy(() => import('src/pages/inventario/bodegas/stock-productos'));

// ======================= VENTAS
const FacturasListPage = lazy(() => import('src/pages/ventas/facturacion/facturas-list'));
const PuntoVentaPage = lazy(() => import('src/pages/ventas/facturacion/punto-venta'));
const ClienteListPage = lazy(() => import('src/pages/ventas/clientes/cliente-list'));
const ClienteCreatePage = lazy(() => import('src/pages/ventas/clientes/cliente-create'));
const ClienteEditPage = lazy(() => import('src/pages/ventas/clientes/cliente-edit'));
const ClienteDetailsPage = lazy(() => import('src/pages/ventas/clientes/cliente-details'));

// ==================================
// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'course', element: <OverviewCoursePage /> },
      // ======================= AUDITORIA
      {
        path: 'auditoria',
        children: [
          { element: <Navigate to="/dashboard/auditoria" replace />, index: true },
          { path: 'eventos-auditoria', element: <EventosAuditoriaPage /> },
        ],
      },
      // ======================= SEGURIDAD
      {
        path: 'seguridad',
        children: [
          { element: <Navigate to="/dashboard/seguridad" replace />, index: true },
          { path: 'perfiles', element: <PefilListPage /> },
          { path: 'horarios', element: <HorariosListPage /> },
          { path: 'tipo-horario', element: <TipoHorarioPage /> },
          { path: 'perfil-opcion', element: <PerfilOpcionPage /> },
        ],
      },
      // ======================= SISTEMA
      {
        path: 'sistema',
        children: [
          { element: <Navigate to="/dashboard/sistema" replace />, index: true },
          { path: 'empresa', element: <Empresa /> },
          { path: 'sucursal', element: <SucursalPage /> },
          { path: 'sistemas', element: <SistemaListPage /> },
          { path: 'opciones', element: <OpcionListPage /> },
          // Usuarios
          { path: 'usuarios/list', element: <UsuarioListPage /> },
          { path: 'usuarios/:id/edit', element: <UsuarioEditPage /> },
          { path: 'usuarios/create', element: <UsuarioCreatePage /> },
        ],
      },
      // ======================= INVENTARIO
      {
        path: 'inventario',
        children: [
          { element: <Navigate to="/dashboard/inventario" replace />, index: true },
          // Productos
          { path: 'productos/list', element: <ProductoListPage /> },
          { path: 'productos/create', element: <ProductoCreatePage /> },
          { path: 'productos/:id/edit', element: <ProductoEditPage /> },
          { path: 'productos/:id/details', element: <ProductoDetailsPage /> },
          // Categorias
          { path: 'categorias/list', element: <CategoriasListPage /> },
          // Bodegas
          { path: 'bodegas/list', element: <BodegasListPage /> },
          { path: 'bodegas/trn', element: <MovimientosBodegaPage /> },
          { path: 'bodegas/create', element: <BodegasCreatePage /> },
          { path: 'bodegas/:id/edit', element: <BodegasEditPage /> },
          { path: 'bodegas/stock', element: <StockProductosPage /> },
        ],
      },
      {
        path: 'ventas',
        children: [
          { element: <Navigate to="/dashboard/ventas" replace />, index: true },
          // Clientes
          { path: 'clientes/list', element: <ClienteListPage /> },
          { path: 'clientes/create', element: <ClienteCreatePage /> },
          { path: 'clientes/:id/edit', element: <ClienteEditPage /> },
          { path: 'clientes/:id/details', element: <ClienteDetailsPage /> },
          // Facturas
          { path: 'facturacion/list', element: <FacturasListPage /> },
          { path: 'facturacion/puntoventa', element: <PuntoVentaPage /> },
        ],
      },
      // ==================================

      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
