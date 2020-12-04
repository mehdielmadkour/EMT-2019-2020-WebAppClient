import { Component, OnInit } from '@angular/core';
import { Socket } from '../service/socket/socket';
import { Router } from '@angular/router';


/**
 *  CarSimulationComponent is the module that allows to send data to the server to simulate the car 
 */
@Component({
  selector: 'app-car-simulation',
  templateUrl: './car-simulation.component.html',
  styleUrls: ['./car-simulation.component.css']
})
export class CarSimulationComponent implements OnInit {

  /**
   * The object that contains informations about the car
   */
  carData: any = {};
  
  /**
   * The object of type Socket that control the communication with the server
   */
  socket: Socket = new Socket();

  /**
   * The constructor of the module.
   * Redirect non admin users to the login page.
   * 
   * @param router an object of type Router
   */
  constructor( router: Router ) { 
    if (JSON.parse(localStorage.getItem('user')).access != 'admin') router.navigate(['/login']);
  }

  /**
   * Method executed when the module is loaded.
   * Start the socket connection.
   */
  ngOnInit() {
    this.socket.start()
  }

  /**
   * Send informations to the server
   */
  send(){
    this.socket.sendCarData(this.carData.data);
  }

}
