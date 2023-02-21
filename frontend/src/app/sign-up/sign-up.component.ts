import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login/loginService/login.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  hide = true
  signupForm!: FormGroup;
  submitted = false
  status = ""

  constructor(private formBuilder:FormBuilder, private auth:LoginService, private router:Router) { }

  ngOnInit(): void {
    //validations

    this.signupForm = this.formBuilder.group({
      email:['', [Validators.required,Validators.email]],
      userName:['', [Validators.required,Validators.minLength(4)]],
      password:['', [Validators.required,Validators.minLength(6)]]
    })
  }
  get f() { return this.signupForm.controls; }

  onSubmit(){
    this.submitted = true
    
    if(this.signupForm.invalid){ 
      return
    }
    else{
      
      // console.log(this.signupForm.value)
      let data = this.signupForm.value
      // alert(JSON.stringify(data))
      this.auth.signup(data).subscribe(res=>{
        // console.log(res)
        let userData:any = res

        if(userData.status == "1"){
          console.log(userData.status)
          this.status = "Email already exists"
          return
        }else if(userData.status == "2"){
          console.log(userData.status)
          this.status = "User name already exists"
          return
        }
      
        localStorage.setItem('token', userData[1])
        localStorage.setItem('id', userData[0]._id)
    
         
        this.router.navigateByUrl('home')
      })

    }
  }

}
