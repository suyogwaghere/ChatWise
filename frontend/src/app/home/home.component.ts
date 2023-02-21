import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatSidenav } from '@angular/material';
// import { MatDrawer } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChatService } from '../userService/chat.service';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  Breakpoints = Breakpoints;
  Mode:any = {
    value: ''
  }
  // @ViewChild(MatDrawer)
  // sidebar!: MatDrawer;

  users: any = []
  usersArray: any = [{}]
  id = localStorage.getItem('id')

  userDetails = {                         
    sender: localStorage.getItem('user')
  }
  mutedUsers:any = []
  blockedUsers:any = []
  loginedUserDetails:any = {}

  constructor(private breakpointObserver: BreakpointObserver, private chatService: ChatService, private router: Router) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        // this.sidebar.mode = "over";
        this.Mode.value = 'over'
      } else {
        this.Mode.value = "side"
        // this.sidebar.mode = 'side';
      }
    });

    this.chatService.allUsers().subscribe(res => {
      // console.log(res)
      this.users = res
      if (this.usersArray == "") {
        console.log('empty')
        return
      } else {
        this.users.forEach((value: any, index: any) => {   // for excluding the logined user from the user's list 
          if (value._id == this.id) {
            this.users.splice(index, 1)
          }
        });
      }

    })
  }

  singleUser(id: any) {
    this.router.navigateByUrl(`home/user/chat/${id}`)
    // console.log(id)
    // RouterLinkActive
  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    this.router.navigateByUrl('/login')
  }

  loginedUser(){
    this.chatService.loginedUser(this.userDetails.sender).subscribe(res=>{
      this.loginedUserDetails = res
      this.mutedUsers = this.loginedUserDetails.mutedUsers
      this.blockedUsers = this.loginedUserDetails.blockedUsers
    })
  }

}
