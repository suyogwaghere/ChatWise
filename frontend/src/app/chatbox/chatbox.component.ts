import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../userService/chat.service';
import { SocketioService } from '../userService/socketio.service';
import { io } from 'socket.io-client';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef; 

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  onlineStatus = "online"
  receiver: any = []         // to receive data coming from backend
  userName = ""              // recipient user name
  msg =                      // to send details to backend when send message function called
    {
      msg: "",               
      sender: localStorage.getItem('user'),
      receiver: ""
    }



  messages: any = []         // array to store messages coming from backend
  newMessage = '';           // variable to store new messages when send button clicked

  socket = io('http://192.168.0.17:5000')    // websocket connection string
  // socket = io('http://localhost:5000')    // websocket connection string

  userDetails = {                         // to send sender and recipient names to backend for creating chat rooms 
    sender: localStorage.getItem('user'),
    recipient: ""
  }
  value:any

  loginedUserDetails:any={}               // to store logined user's data
  mutedUsers:any = []                     // to store only muted users 
  blockedUsers:any = []                   // to store only blocked users
  recipientBlockedUsers:any = []          // to store only blocked users of recipient

  constructor(private activeRoute: ActivatedRoute, private chatService: ChatService, 
    private router: Router, private socketioService: SocketioService,
    private snackBar: MatSnackBar) { }



  ngOnInit(): void {

    this.activeRoute.params.subscribe(params => {
      this.socket.disconnect()
      let id = params.id
      this.chatService.singleUser(id).subscribe(res => {
        this.receiver = res
        this.receiver = this.receiver[0]
        this.recipientBlockedUsers = this.receiver.blockedUsers
        this.userName = this.receiver.userName
        this.loginedUser()     // calling to store details of logined user
        this.socket = io('http://192.168.0.17:5000')
        // this.socket = io('http://localhost:5000')
        this.messages = []
    
        this.userDetails.recipient = this.userName
        this.socket.emit('register', this.userDetails);
        this.socket.on('old_message', (oldMsg) => {       
          // console.log("from backend ",oldMsg);
          this.messages = oldMsg

        })

        // Listen for messages
        this.socket.on('new_message', (message) => {
          this.openSnackBar(message)
          this.messages.push(message)
          // console.log(this.messages);
        });
      })

    })


  }

  // for always show bottom of the scrollable page
  ngAfterViewChecked(){
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }


  // 
  sendMsg() {
 
    if(this.newMessage != ""){
      this.msg.msg = this.newMessage
      this.msg.receiver = this.userName
      this.socket.emit('send_message', this.msg );
      this.newMessage = '' 
    }
    

  }

  // for showing notification on incoming messages
  openSnackBar(msg:any) {
    if(msg.sender == localStorage.getItem('user')){
      return
    }else if(this.mutedUsers.includes(this.userDetails.recipient)){
      return
    }
    else{
      this.snackBar.open(`${msg.sender} : ${msg.msg}`, 'Close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    }
    
     
  }

  // mute function
  muteUser(){
    this.chatService.muteUsers(this.userDetails).subscribe(res=>{
      console.log(res);
      this.loginedUser()        // for refreshing to show muted or unmuted 
    })
  }

  //Unmute function
  unMuteUser(){
    this.chatService.unMuteUser(this.userDetails).subscribe(res=>{
      console.log(res);
      this.loginedUser()        // for refreshing to show muted or unmuted
    })
  }

  // for storing logined user's details
  loginedUser(){
    this.chatService.loginedUser(this.userDetails.sender).subscribe(res=>{
      this.loginedUserDetails = res
      this.mutedUsers = this.loginedUserDetails.mutedUsers
      this.blockedUsers = this.loginedUserDetails.blockedUsers
      this.recipientBlockedUsers = this.receiver.blockedUsers
      // console.log("sender : ",this.blockedUsers);
      // console.log("recipient : ", this.recipientBlockedUsers);
      
    })
  }

  // block function 
  blockUser(){
    this.chatService.blockUser(this.userDetails).subscribe(res =>{
      console.log(res);
      this.loginedUser()
    })
  }

  // unblock user
  unblockUser(){
    this.chatService.unblockUser(this.userDetails).subscribe(res =>{
      console.log(res);
      this.loginedUser()
    })
  }
}
