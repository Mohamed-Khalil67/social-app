import { Routes } from '@angular/router';
import {AuthLayout} from './layouts/auth-layout/auth-layout';
import {MainLayout} from './layouts/main-layout/main-layout';
import {Login} from './features/login/login';
import {Register} from './features/register/register';
import {Timeline} from './features/timeline/timeline';
import {Profile} from './features/profile/profile';
import {Changepassword} from './features/changepassword/changepassword';
import {Notfound} from './features/notfound/notfound';
import {Notifications} from './features/notifications/notifications';
import {Settings} from './features/settings/settings';

export const routes: Routes = [
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path:'', component:AuthLayout, children:[
      {path: 'login', component:Login},
      {path: 'register', component:Register},
    ]},
  {path:'', component:MainLayout, children:[
      {path:'timeline', component:Timeline},
      {path:'profile', component:Profile},
      {path:'notifications', component:Notifications},
      {path:'settings', component:Settings},
      {path:'change',component:Changepassword}
    ]},
  {path:'**', component:Notfound}
];
