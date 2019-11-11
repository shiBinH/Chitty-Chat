import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path: 'chatbox', component: ChatboxComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
