import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AddPoemComponent } from './add-poem/add-poem.component';
import { SinglePoemComponent } from './single-poem/single-poem.component';
import { PoemListComponent } from './poem-list/poem-list.component';
import { AuthService } from './auth.service';
import { AddSkillComponent } from './add-skill/add-skill.component';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SingleSkillComponent } from './single-skill/single-skill.component';
import { PoemComponent } from './poem/poem.component';


const routes: Routes = [
  {path : 'home' , component : HomeComponent},
  {path : 'poem' , component : PoemComponent},
  {path : 'skillList' , component : SkillListComponent},
  {path : 'login' ,component : LoginComponent},
  { path : 'addPoem' , canActivate: [AuthService] ,component : AddPoemComponent},
  {path : 'singlePoem/:id' , canActivate: [AuthService] ,component : SinglePoemComponent},
  {path : 'singleSkill/:id' , canActivate: [AuthService] ,component : SingleSkillComponent},
  {path : 'poemList' , canActivate: [AuthService] ,component : PoemListComponent},
  {path : 'addSkill', canActivate: [AuthService] , component : AddSkillComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
