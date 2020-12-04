import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Socket } from '../service/socket/socket';


/**
 * LoginComponent is the module used to connect the user to the application
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * The object that represents the user
   */
  user: any = {};
  
  /**
   * The object of type Socket that control the communication with the server
   */
  socket: Socket = new Socket();

  /**
   * The constructor of the module.
   * Redirect connected users to the tracking page.
   * 
   * @param router an object of type Router
   */
  constructor( private router: Router ) {
    
    localStorage.setItem('EasterEgg1', JSON.stringify({enable: false}));
    if (JSON.parse(localStorage.getItem('user'))) {
      if (JSON.parse(localStorage.getItem('user')).validated == true) {
        router.navigate(['/tracking']);
      }
    }
  }

  /**
   * Method executed when the module is loaded.
   * Start the socket connection.
   */
  ngOnInit() {
    this.socket.start();
  }

  /**
   * Send user informations to the server
   */
  login() {

    var user = this.user;
    this.socket.connect(user, this.loginCallback, this);
  }

  /**
   * Method called by the socket when the user is received.
   * 
   * @param user the object that contains informations about the user
   * @param context The context of the connection 
   */
  loginCallback(user: any, context: LoginComponent){

    if (user.validated == true){
      localStorage.setItem('user', JSON.stringify(user));
      context.socket.close();
      context.router.navigate(['/tracking']);
    }
  }

  /**
   * Redirect the user to the register page
   */
  register() {
    this.router.navigate(['/register']);
  }

  recover() {
    this.router.navigate(['/recovery']);
  }
}
