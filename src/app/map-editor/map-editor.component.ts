import { Component, OnInit } from '@angular/core';
import { Circuit } from '../service/map/map';
import { Socket } from '../service/socket/socket';
import { Router } from '@angular/router';


/**
 * MapEditorComponent is the module that allows to edit to route to show on the map
 */
@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit {

  /**
   * The clickable map that contains the route
   */
  circuit: Circuit = new Circuit();
    
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
   * Load the map.
   */
  ngOnInit() {
    this.socket.start();
    this.circuit.load();
  }

  /**
   * Send the updated version of the route to the server 
   */
  send(){
    this.socket.updateMap(JSON.stringify(this.circuit.coordinates));
  }

}
