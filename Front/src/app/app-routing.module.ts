import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AddPoemComponent } from './add-poem/add-poem.component';
import { SinglePoemComponent } from './single-poem/single-poem.component';
import { PoemListComponent } from './poem-list/poem-list.component';


const routes: Routes = [
  {path : 'home' , component : HomeComponent},
  {path : 'login' , component : LoginComponent},
  { path : 'addPoem' , component : AddPoemComponent},
  {path : 'singlePoem/:id' , component : SinglePoemComponent},
  {path : 'poemList' , component : PoemListComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
