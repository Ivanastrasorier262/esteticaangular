import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private autenticated = false;
  private user: firebase.User|null = null;

  constructor(private auth: AngularFireAuth, private router: Router) { this.bind();}

  bind(){
    const self = this;
    this.auth.onAuthStateChanged(user => {
      console.log('onAuthStateChanged', user);
      if(user){
        self.autenticated = true;
        self.user = user;
      } else {
        self.autenticated = false;
        self.user = null;
      }
    });
  }

  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut().then(()=>{
      this.router.navigate(['auth/login']);
    });
  }

}
