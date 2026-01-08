import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { LabelComponent } from './pages/label/label.component';
import { EditorComponent } from './pages/editor/editor.component';
import { MasterLabelComponent } from './pages/master-label/master-label.component';
import { MasterLabelDetailComponent } from './pages/master-label-detail/master-label-detail.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AuthGuard } from './services/auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { roleGuard } from './services/auth/guards/role.guard';
import { MasterUserComponent } from './pages/master-user/master-user.component';
import { FabricEditorComponent } from './pages/fabric-editor/fabric-editor.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: DashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'staff'] },
      },

      {
        path: 'label',
        component: LabelComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'staff'] },
      },
      {
        path: 'editor',
        component: EditorComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'staff'] },
      },
      {
        path: 'master-label',
        component: MasterLabelComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'master-label/detail/:id',
        component: MasterLabelDetailComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'master-users',
        component: MasterUserComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'fabric-editor',
        component: FabricEditorComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
