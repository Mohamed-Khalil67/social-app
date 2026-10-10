import { Routes } from '@angular/router';
import {AuthLayout} from './layouts/auth-layout/auth-layout';
import {MainLayout} from './layouts/main-layout/main-layout';
import {Login} from './features/login/login';
import {Register} from './features/register/register';
import {Forgetpassword} from './features/forgetpassword/forgetpassword';
import {Timeline} from './features/timeline/timeline';
import {Profile} from './features/profile/profile';
import {Changepassword} from './features/changepassword/changepassword';
import {Notfound} from './features/notfound/notfound';

export const routes: Routes = [
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path:'', component:AuthLayout, children:[
      {path: 'login', component:Login},
      {path: 'register', component:Register},
      {path: 'forget',component:Forgetpassword}
    ]},
  {path:'', component:MainLayout, children:[
      {path:'timeline', component:Timeline},
      {path:'profile', component:Profile},
      {path:'notification', component:Notification},
      {path:'change',component:Changepassword}
    ]},
  {path:'**', component:Notfound}
];
