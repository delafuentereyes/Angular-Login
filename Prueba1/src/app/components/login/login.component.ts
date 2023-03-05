import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginUser: any ={
    email:'',
    password:''
  }
  constructor(private authService:AuthService) { }

  ngOnInit(): void {

  }
  //metodo para la autenticación
  login(loginUser:any){
    this.authService.login(loginUser.email, loginUser.password)
  }
}
