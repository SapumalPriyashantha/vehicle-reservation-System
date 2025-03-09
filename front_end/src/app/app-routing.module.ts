import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGuard } from './utility/guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent }, 
  {
    
    path: 'pre-login',
    loadChildren: () => import('./components/pre-login/pre-login.module').then(m => m.PreLoginModule)
  },
  {
    path: 'post-login',
    loadChildren: () => import('./components/post-login/post-login.module').then(m => m.PostLoginModule),
    canMatch: [AuthGuard],
  },
  { path: '**', redirectTo: 'pre-login/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
