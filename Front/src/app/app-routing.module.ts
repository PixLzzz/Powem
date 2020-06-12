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
import { PoemHomeComponent } from './poem-home/poem-home.component';
import { SkillHomeComponent } from './skill-home/skill-home.component';
import { ContactComponent } from './contact/contact.component';
import { OtherComponent } from './other/other.component';
import { OtherListComponent } from './other-list/other-list.component';
import { SingleOtherComponent } from './single-other/single-other.component';



const routes: Routes = [
  {path : 'home' , component : HomeComponent},
  {path : 'poemHome' , component : PoemHomeComponent},
  {path : 'skillHome' , component : SkillHomeComponent},
  {path : 'home' , component : HomeComponent},
  {path : 'poem' , component : PoemComponent},
  {path : 'other' , component : OtherComponent},
  {path : 'skillList' , component : SkillListComponent},
  {path : 'login' ,component : LoginComponent},
  { path : 'addPoem' , canActivate: [AuthService] ,component : AddPoemComponent},
  {path : 'singlePoem/:id' , canActivate: [AuthService] ,component : SinglePoemComponent},
  {path : 'singleSkill/:id' , canActivate: [AuthService] ,component : SingleSkillComponent},
  {path : 'singleOther/:id' , canActivate: [AuthService] ,component : SingleOtherComponent},
  {path : 'poemList' , canActivate: [AuthService] ,component : PoemListComponent},
  {path : 'otherList' , canActivate: [AuthService] ,component : OtherListComponent},
  {path : 'addSkill', canActivate: [AuthService] , component : AddSkillComponent},
  {path : 'contact' , component: ContactComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
