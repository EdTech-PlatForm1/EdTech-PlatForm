import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReviewsComponent } from './features/review/review';

export const routes: Routes = [
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  { path: 'store', loadChildren: () => import('./features/store/store.module').then(m => m.StoreModule) },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'orders', loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'tutorials', loadChildren: () => import('./features/tutorials/tutorials.module').then(m => m.TutorialsModule) },
  { path: 'challenges', loadChildren: () => import('./features/challenges/challenges.module').then(m => m.ChallengesModule) },
  { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
  { path: 'reviews', component: ReviewsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

