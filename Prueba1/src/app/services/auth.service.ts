import { AnimateTimings } from '@angular/animations';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore'

import { Router } from '@angular/router';
import { User } from '../models/user';

import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData:any;
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private messageService: MessageService

  )
  //metodo que permite guardar los datos del usuario en el almacenamiento local en la store si la sesión está iniciada
  {
    this.afAuth.authState.subscribe(user=>{
      if (user){
        this.userData=user;
        localStorage.setItem('user',JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!) //el signo de exclamación es porque el dato que se le pasa puede ser null
      }else{
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!)
      }
    })
  }

  setUserData(user:any){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `user/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email
    };
    return userRef.set(userData, {
      merge:true
    });
  }

  login(email: string, password: string){
    return this.afAuth.signInWithEmailAndPassword(email, password)
    .then(result=>{
      this.setUserData(result.user);
      this.afAuth.authState.subscribe(user=>{
        if(user){
          this.router.navigate(['home'])
        }
      })
    }).catch(()=>{
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Message Content'});
    })
  }

  register(email: string, password: string){
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(result=>{
      this.setUserData(result.user);
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
    }).catch(()=>{
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Message Content'});
    })
  }
}


