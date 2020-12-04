import { Component, OnInit } from '@angular/core';
import { Socket } from '../service/socket/socket';
import { Router } from '@angular/router';


/**
 * DownloadComponent is the module used to download informations about the car in a csv file
 */
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  
  /**
   * The object of type Socket that control the communication with the server
   */
  socket: Socket = new Socket();

  /**
   * The constructor of the module.
   * Redirect non admin users and non strategy users to the login page.
   * 
   * @param router an object of type Router
   */
  constructor( private router: Router ) {
    if (JSON.parse(localStorage.getItem('user')).access != 'admin' && JSON.parse(localStorage.getItem('user')).access != 'strategy') router.navigate(['/login']);
  }

  /**
   * Method executed when the module is loaded.
   * Start the socket connection.
   * Request the file to the server
   */
  ngOnInit() {
    this.socket.start();
    this.socket.downloadData(this.dataFileCallback, this);
  }

  /**
   * Method called by the socket when the name of the file is received.
   * Download the file.
   * 
   * @param path a string that represent the name of the file
   * @param context The context of the request
   */
  dataFileCallback(data: string, context: DownloadComponent){
    
    console.log(data)

    var filename = 'data.csv'

    var blob = new Blob([data], {type: 'text/plain'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')
    
        var e = document.createEvent('MouseEvents'),
          a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    // window.location.href='https://mehdielmadkour.ovh/' + path;
    context.router.navigate(['/strategy']);
  }

}
