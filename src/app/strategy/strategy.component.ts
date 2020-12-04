import { Component, OnInit } from '@angular/core';
import { Map, MapS } from '../service/map/map';
import { Socket } from '../service/socket/socket';
import { Router } from '@angular/router';
import { DataTable } from '../service/dataTable/data-table';
import * as $ from "jquery";

/**
 * StrategyComponent is the module that allows to track the car, to see signals ont the map and to control the dashboard
 */
@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css']
})
export class StrategyComponent implements OnInit {

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
   * The state of the dashboard
   */
  dashboardState: String = "false";
  
  /**
   * The table that contains informations about the car
   */
  table: DataTable = new DataTable();

  /**
   * The constructor of the module.
   * Redirect non admin users and non strategy users to the login page.
   * 
   * @param router an object of type Router
   */
  constructor( router: Router ) { 
    if (JSON.parse(localStorage.getItem('user')).access != 'admin' && JSON.parse(localStorage.getItem('user')).access != 'strategy') router.navigate(['/login']);
  }
  
  /**
   * Method executed when the module is loaded.
   * Start the socket connection.
   * Load the map.
   * Create the table.
   */
  ngOnInit() {
    
    this.socket.start();

    this.map.load();
    this.mapS = new MapS(this.map);
    this.mapS.load(this);
    this.socket.getDashBoardState(this.updateDashBoardCommand);
    this.socket.receiveSignalUpdate(this, this.signalUpdateReceiver);
    this.socket.getCarData(this.carDataCallback, this);
    this.socket.getMap(this.mapCallback, this);
    var txt: string = this.table.generTab(['VITESSE', 'CONSOMMATION', 'TOURS_RESTANT', 'TEMPS_RESTANT', 'TENSION', 'INTENSITE']);
    $('#dataTable').append(txt);
  }

  /**
   * Method called by the socket when the route is received
   * 
   * @param route the route to show on the map
   * @param context The context of the request 
   */
  mapCallback(route: string, context: StrategyComponent){
    context.map.setCircuit(route);
  }

  /**
   * Method called by the socket when a signal is received
   * 
   * @param action a string that represents the action (add or remove)
   * @param context the context of the request 
   * @param Point the object that represents the signal
   */
  signalUpdateReceiver(action: string, context: StrategyComponent, Point: any){
    
    if (action == "add"){
      context.mapS.addPoint(Point); // création d'un point
    }
    if (action == "remove"){
      context.mapS.removePoint(Point);
    }
  }

  /**
   * Update the text of the command button
   * 
   * @param state the new value of the dashboard state
   */
  updateDashBoardCommand(state: String){
    if (state == "true"){
      $('#dashBoardCommand').empty();
      $('#dashBoardCommand').append("Stop");
    }
    else {
      $('#dashBoardCommand').empty();
      $('#dashBoardCommand').append("Start");
    }
  }

  /**
   * Change the dashboard state
   */
  switchDashBoardState(){
    if (this.dashboardState == "true") {
      this.dashboardState = "false";
      this.socket.stopDashBoard();
    }
    else {
      this.dashboardState = "true";
      this.socket.startDashBoard();
    }

    this.updateDashBoardCommand(this.dashboardState);
  }

  speedUp(){
    this.socket.speedUp();
  }

  slowDown(){
    this.socket.slowDown();
  }

  /**
   * Method called by the socket when new informations are received
   * 
   * @param carData the new informations
   * @param context The context of the request 
   */
  carDataCallback(carData: any, context: StrategyComponent){
    var data = JSON.parse(carData);

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
