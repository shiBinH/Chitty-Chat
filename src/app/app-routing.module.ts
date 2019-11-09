import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from 'ngx-auth-firebaseui';
const routes: Routes = [
  { path: '', redirectTo: 'chatbox', pathMatch: 'full' },
  {
    path: 'chatbox',
    loadChildren: 'app/chatbox/chatbox.module#ChatboxModule',
    canActivate: [LoggedInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
