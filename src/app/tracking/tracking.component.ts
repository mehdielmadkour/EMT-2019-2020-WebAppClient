import { Component, OnInit } from '@angular/core';
import { Map } from '../service/map/map';
import { Socket } from '../service/socket/socket';
import { DataTable } from '../service/dataTable/data-table';
import * as $ from "jquery";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  value: string;
  unit: string;
}

/**
 * TrackingComponent is th module that allows to track the car
 */
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
      
  /**
   * The object of type Socket that control the communication with the server
   */
  socket = new Socket();

  /**
   * The map that show the position of the car and the route
   */
  map: Map = new Map();

  /**
   * The table that contains informations about the car
   */
  table: DataTable = new DataTable();

  tiles: Tile[];

  constructor( ) { }

  /**
   * Method executed when the module is loaded.
   * Start the socket connection.
   * Load the map.
   * Create the table.
   */
  ngOnInit() {

    this.socket.start();
    
    this.map.load();
    var txt: string = this.table.generTab(['VITESSE', 'CONSOMMATION', 'TOURS_RESTANT', 'TEMPS_RESTANT', 'TENSION', 'INTENSITE']);
    this.tiles  = [
      {text: 'Vitesse', cols: 2, rows: 2, color: 'lightgrey', value: '0', unit: 'km/h'},
      {text: 'Temps restant', cols: 2, rows: 1, color: 'lightgrey', value: '00:00', unit: ''},
      {text: 'Tours restant', cols: 1, rows: 1, color: 'lightgrey', value: '0', unit: ''},
      {text: 'Tension', cols: 1, rows: 1, color: 'lightgrey', value: '0', unit: 'V'},
      {text: 'Consommation', cols: 3, rows: 1, color: 'lightgrey', value: '0', unit: 'J'},
      {text: 'Intensité', cols: 1, rows: 1, color: 'lightgrey', value: '0', unit: 'A'},
    ];
    $('#dataTable').append(txt);
    this.socket.getCarData(this.carDataCallback, this);
    this.socket.getMap(this.mapCallback, this);
    
  }

  /**
   * Method called by the socket when the route is received
   * 
   * @param route the route to show on the map
   * @param context The context of the request 
   */
  mapCallback(route: string, context: TrackingComponent){
    context.map.setCircuit(route);
  }

  /**
   * Method called by the socket when new informations are received
   * 
   * @param carData the new informations
   * @param context The context of the request 
   */
  carDataCallback(carData: any, context: TrackingComponent){
    var data = JSON.parse(carData);

    // this.tiles.forEach(tile => {
    //   switch (tile.text) {
    //     case 'Vitesse':
    //       tile.value = data.speed;
    //       break;
    //     case 'Consommation':
    //       tile.value = data.consumption;
    //       break;
    //     case 'Temps restant':
    //       tile.value = data.time;
    //       break;
    //     case 'Tours restant':
    //       tile.value = data.lap;
    //       break;
    //     case 'Tension':
    //       tile.value = data.voltage;
    //       break;
    //     case 'Intensité':
    //       tile.value = data.current;
    //       break;
    //     default:
    //       break;
    //   }
    // });

    $('#VITESSE').empty();
    $('#VITESSE').append(data.speed);

    $('#CONSOMMATION').empty();
    $('#CONSOMMATION').append(data.consumption);

    $('#TOURS_RESTANT').empty();
    $('#TOURS_RESTANT').append(data.lap);

    $('#TEMPS_RESTANT').empty();
    $('#TEMPS_RESTANT').append(data.time);

    $('#TENSION').empty();
    $('#TENSION').append(data.voltage);

    $('#INTENSITE').empty();
    $('#INTENSITE').append(data.current);

    context.map.jump(data.longitude, data.latitude);
    
  }
}
