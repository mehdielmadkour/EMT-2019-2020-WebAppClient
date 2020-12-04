import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

/**
 * 
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  /**
   * The informations about the user
   */
  user: any = JSON.parse(localStorage.getItem('user'));

  /**
   * Count the number of click on the logo
   */
  clickNumber: number = 0;

  msbapTitle = 'EasterEgg1';
  msbapAudioUrl = 'assets/sounds/oui-oui.mp3';   
    
  msbapDisplayTitle = false; 
  msbapDisplayVolumeControls = false;
  msbapAutoPlay = false;

  /**
   * The constructor of the module.
   * 
   * @param router an object of type Router
   */
  constructor( private router: Router ) { 
    if (JSON.parse(localStorage.getItem('EasterEgg1')).enable){
      this.msbapAutoPlay = true;
    }
  }

  /**
   * Method executed when the module is loaded.
   * Show links in the navbar according to the access of the user
   */
  ngOnInit() {

    if (this.user.access == "guest"){
      
      $('#menu').empty();
    }

    if (this.user.access != "team" && this.user.access != "strategy" && this.user.access != "admin"){
      $('#signalementLink').empty();
    }

    if (this.user.access != "strategy" && this.user.access != "admin"){
      $('#strategyDivider').empty();
      $('#strategyLink').empty();
      $('#downloadDivider').empty();
      $('#downloadLink').empty();
    }

    if (this.user.access != "admin"){
      $('#adminDivider').empty();
      $('#adminLink').empty();
      $('#carSimulationLink').empty();
      $('#carSimulationDivider').empty();
      $('#mapEditorLink').empty();
      $('#mapEditorDivider').empty();
    }
    
  }

  /**
   * Disconnect the user from the application.
   * Redirect the user to the login page
   */
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  /**
   * Redirect the user to the tracking page
   */
  trackingRedirection(){ this.router.navigate(['/tracking']); }
  
  /**
   * Redirect the user to the signalment page
   */
  signalementRedirection(){ this.router.navigate(['/signalement']); }
  
  /**
   * Redirect the user to the strategy page
   */
  strategyRedirection(){ this.router.navigate(['/strategy']); }
  
  /**
   * Redirect the user to the download page
   */
  downloadRedirection(){ this.router.navigate(['/download']); }
  
  /**
   * Redirect the user to the admin page
   */
  adminRedirection(){ this.router.navigate(['/admin-panel']); }
  
  /**
   * Redirect the user to the simulation page
   */
  simulationRedirection(){this.router.navigate(['/simulation']); }
  
  /**
   * Redirect the user to the map editor page
   */
  editorRedirection(){this.router.navigate(['/editor']); }

  /**
   * Enable the easter egg 1 when the user clicks 3 times on the logo
   */
  clickOnLogo(){
    this.clickNumber = this.clickNumber + 1;
    if (this.clickNumber >= 3){
      if (JSON.parse(localStorage.getItem('EasterEgg1')).enable) localStorage.setItem('EasterEgg1', JSON.stringify({enable: false}));
      else localStorage.setItem('EasterEgg1', JSON.stringify({enable: true}));
      window.location.reload();
    }
  }
}
