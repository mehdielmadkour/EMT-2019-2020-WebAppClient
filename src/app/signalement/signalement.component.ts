import { Component, OnInit } from '@angular/core';
import { Map, MapS } from '../service/map/map';
import { Socket } from '../service/socket/socket';
import { Router } from '@angular/router';

/**
 * SignalComponent is the module that allows to signal accident on the map
 */
@Component({
  selector: 'app-signalement',
  templateUrl: './signalement.component.html',
  styleUrls: ['./signalement.component.css']
})
export class SignalementComponent implements OnInit {

  /**
   * The map that show the position of the car and the route
   */
  map: Map = new Map();
    
  /**
   * The extension of the map that allows to see signals
   */
  mapS: MapS;
          
  /**
   * The object of type Socket that control the communication with the server
   */
  socket = new Socket();

  /**
   * The constructor of the module.
   * Redirect guest users to the login page.
   * 
   * @param router an object of type Router
   */

  constructor( router: Router ) { 
    if (JSON.parse(localStorage.getItem('user')).access != 'admin' && JSON.parse(localStorage.getItem('user')).access != 'strategy' && JSON.parse(localStorage.getItem('user')).access != 'team') router.navigate(['/login']);
  }
    
  /**
   * Method executed when the module is loaded.
   * Start the socket connection.
   * Load the map.
   */
  ngOnInit() {
    
    this.socket.start();

    this.map.load();
    this.mapS = new MapS(this.map);
    this.mapS.load(this);
    this.socket.receiveSignalUpdate(this, this.signalUpdateReceiver);
    this.socket.getCarData(this.carDataCallback, this);
    this.socket.getMap(this.mapCallback, this);
  }

  /**
   * Method called by the socket when a signal is received
   * 
   * @param action a string that represents the action (add or remove)
   * @param context the context of the request 
   * @param Point the object that represents the signal
   */
  signalUpdateReceiver(action: string, context: SignalementComponent, Point: any){
    
    if (action == "add"){
      context.mapS.addPoint(Point); // création d'un point
    }
    if (action == "remove"){
      context.mapS.removePoint(Point);
    }
  }

  /**
   * Method called by the socket when new informations are received
   * 
   * @param carData the new informations
   * @param context The context of the request 
   */
  carDataCallback(carData: any, context: SignalementComponent){

    var data = JSON.parse(carData);
    context.map.jump(data.longitude, data.latitude);
    
  }

  /**
   * Method called by the socket when the route is received
   * 
   * @param route the route to show on the map
   * @param context The context of the request 
   */
  mapCallback(map: string, context: SignalementComponent){
    context.map.setCircuit(map);
  }

}
