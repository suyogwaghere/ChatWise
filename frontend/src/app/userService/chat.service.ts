import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient) { }

  api:string="http://192.168.0.17:5000";
  // api:string="http://localhost:5000";

  allUsers(){
    return this.http.get(`${this.api}/user/users`);
  }

  singleUser(id:any){
    return this.http.get(`${this.api}/user/chat/${id}`)
  }

  muteUsers(data:any){
    return this.http.put(`${this.api}/user/mute_users`,{data})
  }

  unMuteUser(data:any){
    return this.http.put(`${this.api}/user/unmute_users`,{data})
  }

  loginedUser(sender:any){
    return this.http.post(`${this.api}/user/logined_user`,{sender})
  }

  blockUser(data:any){
    return this.http.post(`${this.api}/user/block_users`,{data})
  }

  unblockUser(data:any){
    return this.http.post(`${this.api}/user/unblock_users`,{data})
  }
}
