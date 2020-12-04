import { Component, OnInit } from '@angular/core';
import { Socket } from '../service/socket/socket';
import { Router } from '@angular/router';
import * as $ from 'jquery';


/**
 * AdminPanelComponent is the module that allows administrators to manage users and execute SQL requests
 */
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  /**
   * The object that contains the request
   */
  request: any = {command : null};

  /**
   * The object that contains the action
   */
  action: any = {value : null};

  /**
   * The object of type Socket that control the communication with the server
   */
  socket: Socket = new Socket();

  /**
   * The boolean that command the display of the action selector
   */
  displayActionLine: boolean = true;
  
  /**
   * The boolean that command the display of the use selector
   */
  displaySelectLine: boolean = false;
  
  /**
   * The boolean that command the display of the access selector
   */
  displayUpdateLine: boolean = false;

  /**
   * The list which contains users
   */
  userList: any = [];

  /**
   * The object that contains new informations about the user 
   */
  updatedUser: any = {};

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
   * Request the number of connected users
   */
  ngOnInit() {
    this.socket.start();
    this.socket.countSessions(this.countSessionsCallback);
  }

  /**
   * Method called by the socket when the number of connection is received.
   * Display the number on page.
   * 
   * @param nb  a string that represent the number of connected user
   */
  countSessionsCallback(nb: string){
    $('#countSessions').empty();
    $('#countSessions').append(nb);
  }

  /**
   * Method called by the socket when the list of user is received.
   * Append usernames in the user selector.
   * 
   * @param nb  a string that represent an array of user
   */
  userListCallback(data: string){
    var option = "";
    this.userList = eval(data);
    
    for (var i = 0; i < this.userList.length; i++){
      var user = this.userList[i];
      option += "<option value=\"" + user.name + "\">" + user.name + "</option>";
    }
    
    $('#userSelector').append(option);
  }

  /**
   * Select the action choosen by the user.
   * Update the line to display.
   */
  selectAction(){
    if (this.action.value == "update"){
      this.displayUpdateLine = false;
      this.displayActionLine = false;
      this.displaySelectLine = true;
      
      this.socket.getUserList(this.userListCallback);
      
    }
  }

  /**
   * Method called when a user is selected. Display the update line.
   */
  selectUser(){
    this.displayUpdateLine = true;
    this.displayActionLine = false;
    this.displaySelectLine = false;
  }

  /**
   * Send updated informations about the selected user to the server.
   * Display the action selector line.
   */
  updateUserAccess(){
    var user = {name: this.updatedUser.name, access: this.updatedUser.access};
    this.socket.updateAccess(JSON.stringify(user));
    this.displayUpdateLine = false;
    this.displayActionLine = true;
    this.displaySelectLine = false;
  }

  /**
   * Send an SQL request to the server
   */
  execute(){
    this.socket.execute(this.request.command);
  }

  /**
   * Control the display of the update line
   */
  updateLineDisplay() {
    if (this.displayUpdateLine) {
      return 'block';
    } else {
      return 'none';
    }
  }

  /**
   * Control the display of the select line
   */
  selectLineDisplay() {
    if (this.displaySelectLine) {
      return 'block';
    } else {
      return 'none';
    }
  }

  /**
   * Control the display of the action line
   */
  selectActionDisplay() {
    if (this.displayActionLine) {
      return 'block';
    } else {
      return 'none';
    }
  }

}