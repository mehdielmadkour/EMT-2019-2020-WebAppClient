import * as CryptoJS from 'crypto-js';
import * as NodeRSA from 'node-rsa';

declare var JSEncrypt: any;

/**
 * Socket is the class that allows to communicate with the server
 */
export class Socket {

    /**
     * Websocket connection
     */
    socket: WebSocket;

    /**
     * Open the connection to the websocket
     */
    public start = function(){
        
        var mainContext = this;
        
        this.socket = new WebSocket("wss://mehdielmadkour.ovh/appEMT/socket");
        
        this.socket.onmessage = function(socketMessage){
            
            var message = JSON.parse(socketMessage.data);
            console.log(message)
            var readable = true;

            if (message.access != null) {
                var user = JSON.parse(localStorage.getItem('user'));

                console.log(message.data);

                readable = false;

                if (message.access == "guest" && user.access == "guest") readable = true;
                else if (message.access == user.access){


                    var keys = JSON.parse(localStorage.getItem('keys'));
                    var key = null;

                    if (message.access == "team") {
                        key = keys.teamKey;
                    }
                    if (message.access == "strategyKey") {
                        key = keys.strategyKey;
                    }
                    if (message.access == "admin") {
                        key = keys.adminKey;
                    }
                    
                    if (key != null){
                        var decrypt = new JSEncrypt();
                        decrypt.setPrivateKey(key);
                        var decryptedData = decrypt.decrypt(message.data);
                        message.data = decryptedData;
                        readable = true;
                    }
                }
            }

            if (readable){

                if (message.action == "user" && this.connectCallback != null){

                    var user = JSON.parse(message.data);
                    var keys: any = {};

                    user.keys.forEach(userKey => {
                        if (userKey.access == "team") {
                            keys.teamKey = userKey.key;
                        }
                        if (userKey.access == "strategy") {
                            keys.strategyKey = userKey.key;
                        }
                        if (userKey.access == "admin") {
                            keys.adminKey = userKey.key;
                        }
                    });

                    localStorage.setItem('keys', JSON.stringify(keys));
                    /*var decrypt = new JSEncrypt();
                    decrypt.setPrivateKey(user.key);
                    var decryptedData = decrypt.decrypt(user.data);
                    console.log(user.key);
                    console.log(user.data);
                    console.log(decryptedData);*/
                    this.connectCallback(user, this.connectContext);
                }
                
                if (message.action == "signalUpdate" && this.signalUpdateReceiver != null && this.signalReceiverContext != null){
                    var point = JSON.parse(message.data);
                    this.signalUpdateReceiver("add", this.signalReceiverContext, point);
                }

                if (message.action == "removeSignal" && this.signalUpdateReceiver != null && this.signalReceiverContext != null){
                    var point = JSON.parse(message.data);
                    this.signalUpdateReceiver("remove", this.signalReceiverContext, point);
                }

                if (message.action == "sessionNumber" && this.countSessionsCallback != null){
                    this.countSessionsCallback(message.data);
                }

                if (message.action == "dashBoardState" && this.dashBoardStateCallback != null){
                    this.dashBoardStateCallback(message.data);
                }

                if (message.action == "userList" && this.userListCallback != null){
                    this.userListCallback(message.data);
                }

                if (message.action == "dataFile" && this.dataFileCallback != null && this.dataFileContext != null){
                    this.dataFileCallback(message.data, this.dataFileContext);
                }

                if (message.action == "carData" && this.carDataCallback != null && this.carDataContext != null){
                    this.carDataCallback(message.data, this.carDataContext);
                }

                if (message.action == "map" && this.mapCallback != null && this.mapContext != null){
                    this.mapCallback(message.data, this.mapContext);
                }
            } 
        }
    }

    /**
     * Close the connection to the websocket
     */
    public close = function(){
        this.socket.close();
    }

    /**
     * Count the number of connected user
     * 
     * @param {Function} callback  method called when the number of opened sessions are received 
     */
    public countSessions = function(callback){
        this.socket.onopen = function(){
            this.countSessionsCallback = callback;
            this.send(JSON.stringify({action: "getSessionNumber", data:""}));
        }
        
    }

    /**
     * Request the number of opened sessions 
     * 
     * @param {Function} callback  Request the number of opened sessions 
     */
    public getDashBoardState = function(callback){


        this.socket.onopen = function(){
            this.dashBoardStateCallback = callback;
            this.send(JSON.stringify({action: "getDashBoardState", data:""}));
        }
    }

    /**
     * Start the dashboard
     */
    public startDashBoard = function(){
        this.socket.send(JSON.stringify({action: "startDashBoard", data: ""}));
    }

    /**
     * Stop the dashboard
     */
    public stopDashBoard = function(){
        this.socket.send(JSON.stringify({action: "stopDashBoard", data: ""}));
    }

    /**
     * Request signals 
     * 
     * @param {Function} context context of signal display
     * @param {Function} callback  method called when signals are received
     */
    public receiveSignalUpdate = function(context, callback){
        this.socket.signalReceiverContext = context;
        this.socket.signalUpdateReceiver = callback;
    }

    /**
     * Signal a point
     * 
     * @param {Function} point a signal
     */
    public signalOnMap = function(point){
        var message = {action: "signalOnMap", data: JSON.stringify(point)};
        this.socket.send(JSON.stringify(message));
    }
    
    /**
     * Remove a point
     * 
     * @param {Function} id the id o fa point
     */
    public removeSignal = function(id){
        var message = {action: "removeSignal", data: id};
        this.socket.send(JSON.stringify(message));
    }

    /**
     * Connect the user
     * 
     * @param {Function} user informations about the user
     * @param {Function} callback method to call when the result is received
     * @param {Function} context context of the connection
     */
    public connect = function(user: any, callback, context){
        
        var data = {name: user.username, hash: CryptoJS.SHA256(user.password).toString(CryptoJS.enc.Hex)};
        var message = {action: 'connect', data: JSON.stringify(data)};

        this.socket.connectCallback = callback;
        this.socket.connectContext = context;

        this.socket.send(JSON.stringify(message));
    }

    /**
     * Register a new user
     * 
     * @param {Function} user informations about the user
     */
    public register = function(user: any){

        var data = {name: user.username, hash: CryptoJS.SHA256(user.password).toString(CryptoJS.enc.Hex), mail: user.mail};
        var message = {action: 'register', data: JSON.stringify(data)};
        
        this.socket.send(JSON.stringify(message));
    }

    public add_recovery = function(user: any){

        var message = {action: 'add_recovery', data: JSON.stringify(user)};
        
        this.socket.send(JSON.stringify(message));
    }

    public recover = function(recovery: any){

        var data = {code: recovery.code, hash: CryptoJS.SHA256(recovery.password).toString(CryptoJS.enc.Hex)};
        var message = {action: 'recover', data: JSON.stringify(data)};
        
        this.socket.send(JSON.stringify(message));
    }

    /**
     * Send an SQL query to the server
     * 
     * @param {Function} command sql query
     */
    public execute = function(command){
        var message = {action: 'sql', data: command};
        this.socket.send(JSON.stringify(message));
    }

    /**
     * Request the user list
     * 
     * @param {Function} callback method to call when the result is received
     */
    public getUserList = function(callback){
        this.socket.userListCallback = callback;
        this.socket.send(JSON.stringify({action: "getUserList", data:""}));
        
    }

    /**
     * Update the access of a user
     * 
     * @param {Function} updatedUser informations about the user
     */
    public updateAccess = function(updatedUser){
        this.socket.send(JSON.stringify({action: "updateUserAccess", data: updatedUser}));
    }

    /**
     * Request a data file
     * 
     * @param {Function} callback method called when result is received
     * @param {Function} context the context o fthe request
     */
    public downloadData = function(callback, context){
        this.socket.onopen = function(){
            this.dataFileCallback = callback;
            this.dataFileContext = context;
            this.send(JSON.stringify({action: "downloadData", data:""}));
        }
    }

    /**
     * Send informations about the car
     * 
     * @param {Function} carData informations about the car
     */
    public sendCarData = function(carData: string){
        this.socket.send(JSON.stringify({action: "carData", data: carData}));
    }

    /**
     * Request informations about the car
     * 
     * @param {Function} callback method called when informations are received
     * @param {Function} context context of the request
     */
    public getCarData = function(callback, context){
        this.socket.carDataCallback = callback;
        this.socket.carDataContext = context;
    }

    /**
     * Update the route to show on the map
     * 
     * @param {Function} circuit the route to show on the map
     */
    public updateMap(circuit: string){
        this.socket.send(JSON.stringify({action: "updateMap", data: circuit}));
    }

    /**
     * Request the route to show on the map
     * 
     * @param {Function} callback method called when the result is received
     * @param {Function} context context of the request
     */
    public getMap = function(callback, context){
        this.socket.onopen = function(){
            this.mapCallback = callback;
            this.mapContext = context;
            this.send(JSON.stringify({action: "getMap", data:""}));
        }
    }

    public speedUp = function(){
        this.socket.send(JSON.stringify({action: "speedUp", data:""}))
    }

    public slowDown = function(){
        this.socket.send(JSON.stringify({action: "slowDown", data:""}))
    }
}
