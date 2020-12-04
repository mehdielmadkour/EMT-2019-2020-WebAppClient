import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Socket } from '../service/socket/socket';

/**
 * RegisterComponent is the component that allows users to register in the application
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  /**
   * The object that contains informations about the user 
   */
  user: any = {};
      
  /**
   * The object of type Socket that control the communication with the server
   */
  socket: Socket = new Socket();

  /**
   * The constructor of the module.
   * 
   * @param router an object of type Router
   */
  constructor( private router: Router ) { }

  /**
   * Method executed when the module is loaded.
   * Start the socket connection.
   */
  ngOnInit() { 
    this.socket.start();
  }

  /**
   * Send informations about a new user to the server.
   * Redirect the user to the login page.
   */
  register() { 

    if (this.user.password == this.user.confirm){
      console.log(this.user)
      this.socket.register(this.user);
    }
    
    setTimeout(() => {
      this.socket.close(); 
      this.router.navigate(['/login']);
    }, 1000)
    
  }
}
