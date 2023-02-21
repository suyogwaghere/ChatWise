import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignUpComponent},
  {path:'home', canActivate:[AuthGuard], component:HomeComponent,
    children:[
      {path:'',component:DefaultPageComponent},
      {path:'default', component:DefaultPageComponent},
      {path:'user/chat/:id',component:ChatboxComponent}
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
