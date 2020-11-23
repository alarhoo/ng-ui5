import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './views/layout/layout.component';
import { SummaryComponent } from './views/summary/summary.component';
import { DetailComponent } from './views/detail/detail.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'Summary', pathMatch: 'full' },
      { path: 'Summary', component: SummaryComponent },
      { path: 'Detail', component: DetailComponent },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [
  LayoutComponent,
  SummaryComponent,
  DetailComponent,
];
