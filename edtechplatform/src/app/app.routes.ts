import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'store', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
  { path: 'orders', canActivate: [AuthGuard], loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'tutorials', canActivate: [AuthGuard], loadChildren: () => import('./features/tutorials/tutorials.module').then(m => m.TutorialsModule) },
  { path: 'challenges', canActivate: [AuthGuard], loadChildren: () => import('./features/challenges/challenges.module').then(m => m.ChallengesModule) },
  { path: 'profile', canActivate: [AuthGuard], loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'wishlist', canActivate: [AuthGuard], loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent) },
  { path: 'admin', canActivate: [AuthGuard], loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) }
];
