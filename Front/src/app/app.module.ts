import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddSkillComponent } from './add-skill/add-skill.component';
import { SkillListComponent } from './skill-list/skill-list.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'
import {MatSnackBarModule} from '@angular/material/snack-bar';
// Firebase services + enviorment module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AuthService } from './auth.service';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import * as firebase from 'firebase';
import { AddPoemComponent } from './add-poem/add-poem.component';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SinglePoemComponent } from './single-poem/single-poem.component';
import {MatSelectModule} from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import { FirebaseService } from './firebase.service';
import { PoemListComponent } from './poem-list/poem-list.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { SkillServiceService } from './skill-service.service';
import { SingleSkillComponent } from './single-skill/single-skill.component';
import { UploadService } from './upload.service';
import { UploadListComponent } from './uploads/upload-list/upload-list.component';
import { UploadFormComponent } from './uploads/upload-form/upload-form.component';
import { DropzoneDirective } from './dropzone.directive';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { PoemComponent } from './poem/poem.component';
import { DialogSkillComponent } from './dialog-skill/dialog-skill.component';
import { DialogFileComponent } from './dialog-file/dialog-file.component';
import { PoemHomeComponent } from './poem-home/poem-home.component';
import { SkillHomeComponent } from './skill-home/skill-home.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { ContactComponent } from './contact/contact.component';
import { MailSnackbarComponent } from './mail-snackbar/mail-snackbar.component';



    firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    AddPoemComponent,
    SinglePoemComponent,
    PoemListComponent,
    DialogComponent,
    AddSkillComponent,
    SkillListComponent,
    SingleSkillComponent,
    UploadListComponent,
    UploadFormComponent,
    DropzoneDirective,
    PoemComponent,
    DialogSkillComponent,
    DialogFileComponent,
    PoemHomeComponent,
    SkillHomeComponent,
    ContactComponent,
    MailSnackbarComponent
    
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatListModule,
    MatTableModule,
    AngularFireAuthModule,
    BrowserModule,
    FormsModule, 
    AppRoutingModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatDialogModule,
    HttpClientModule,
    MatProgressBarModule,
    MatGridListModule,
    CKEditorModule,
    MatSnackBarModule

  ],
  providers: [AuthService,FirebaseService,SkillServiceService,AngularFireStorage,AngularFirestore,UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
