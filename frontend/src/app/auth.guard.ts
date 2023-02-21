import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login/loginService/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (private auth:LoginService, private router:Router){}
  canActivate():boolean{
    if(this.auth.loggedIn()){
      return true
    }
    else{
      this.router.navigateByUrl('/login')
      return false
    }
  }
  
}
