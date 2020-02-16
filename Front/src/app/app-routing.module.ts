import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AddPoemComponent } from './add-poem/add-poem.component';


const routes: Routes = [
  {path : '' , component : HomeComponent},
  {path : 'login' , component : LoginComponent},
  { path : 'addPoem' , component : AddPoemComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
