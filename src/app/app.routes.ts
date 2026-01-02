import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { LabelComponent } from './pages/label/label.component';
import { EditorComponent } from './pages/editor/editor.component';
import { MasterLabelComponent } from './pages/master-label/master-label.component';
import { MasterLabelDetailComponent } from './pages/master-label-detail/master-label-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: DashboardComponent,
      },
      {
        path: 'label',
        component: LabelComponent,
      },
      {
        path: 'editor',
        component: EditorComponent,
      },
      {
        path: 'master-label',
        component: MasterLabelComponent,
      },
      {
        path: 'master-label/detail/:id',
        component: MasterLabelDetailComponent,
      },
    ],
  },
];
