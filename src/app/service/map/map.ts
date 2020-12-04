import * as mapboxgl from 'mapbox-gl';

/**
 * Map is the class that show the position and the route of the car
 */
export class Map {
    
    /**
     * The mapbox gl representation of a map
     */
    map: mapboxgl.Map;

    /**
     * The mapbox access token
     */
    accessToken = 'pk.eyJ1IjoibWVoZGllbG1hZGtvdXIiLCJhIjoiY2pvNWl3eDVlMDdnbTNxbzA1bmM5MG1zeSJ9.yIWUXIiEktMlPrWV2RIxMA';

    /**
     * The default position of the car
     */
    carCoords = {"geometry": {"type": "Point", "coordinates": [-0.467984, 51.350344]}, "type": "Feature", "properties": {}};

    /**
     * the route container
     */
    circuit = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "LineString",
            //ajoute des points sur la carte
            "coordinates": []
        }
    };

    constructor() { }

    ngOnInit() { }

    /**
     * Load the map
     */
    load() {
    
        //accès à la carte
        Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(this.accessToken);
        
        var context = this;

        //charge la carte
        this.map = new mapboxgl.Map({

            //parametre de la carte
            container: 'map', // element contenant la carte
            style: 'mapbox://styles/mehdielmadkour/cjo5jaot80n1p2sq8wckp7vdl', // adresse de la carte en ligne
            center: [-0.468561, 51.351465], // definition du centre par défaut
            zoom: 14.5, // définition de l'echelle,
            bearing: 100,
            interactive: true // possibilité d'interaction avec la carte
        });

        var points = null;
        
        // attente du chargement de la carte
        this.map.on('load', function(){
            
            var mapContext = this;

            this.loadImage('assets/images/oui_oui.png',
                function(error, image) {
                    if (error) throw error;
                    mapContext.addImage('oui_oui', image);
                }
            );

            this.loadImage('assets/images/flag.png',
                function(error, image) {
                    if (error) throw error;
                    mapContext.addImage('flag', image);
                }
            );

            // ajout de la source "circuit"
            this.addSource('circuit', {
                "type": "geojson",
                "data": context.circuit
            });

            // circuit brooklands
            this.addLayer({
                "id": "route",
                "type": "line",
                "source": "circuit",

                //trace des droites entre les points
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },

                //colorie les droites
                "paint": {
                    "line-color": "#3887be",
                    "line-width": 6
                }
            });
            

            //creation d'un point sur la carte representant la position de depart
            this.addSource('flag', {
                "type": "geojson",
                "data": {"geometry": {"type": "Point", "coordinates": [-0.469753, 51.350743]}, "type": "Feature", "properties": {}}
            });

            // affichage du point de depart
            this.addLayer({
                "id": "flag",
                "type": "symbol",
                "source": "flag",
                // "paint": {
                //     "circle-radius": 10,
                //     "circle-color": "#00f"
                // },
                'layout': {
                    'icon-image': 'flag',
                    'icon-size': 0.25
                }
            });

            //creation d'un point sur la carte representant la position du vehicule
            this.addSource('point', {
                "type": "geojson",
                "data": context.carCoords
            });

            if (JSON.parse(localStorage.getItem('EasterEgg1')).enable){
                // affichage du point
                this.addLayer({
                    "id": "point",
                    "type": "symbol",
                    "source": "point",
                    // "paint": {
                    //     "circle-radius": 10,
                    //     "circle-color": "#00f"
                    // },
                    'layout': {
                        'icon-image': 'oui_oui',
                        'icon-size': 0.4
                    }
                });
            }
            else {
                // affichage du point
                this.addLayer({
                    "id": "point",
                    "type": "circle",
                    "source": "point",
                    "paint": {
                        "circle-radius": 10,
                        "circle-color": "#00f"
                    }
                });
            }

            this.getSource('point').setData(context.carCoords);
            var timer = window.setInterval(function() {
                if (context.carCoords != null){
                    
                    mapContext.getSource('point').setData(context.carCoords);
                    mapContext.getSource('circuit').setData(context.circuit);
                    /*mapContext.removeLayer('point');
                    mapContext.addLayer({
                        "id": "point",
                        "type": "circle",
                        "source": "point",
                        "paint": {
                            "circle-radius": 10,
                            "circle-color": "#00f"
                        }
                    });*/
                }

            }, 1000);

            
            
        });

    }

    /**
     * Move to point to the new position
     * 
     * @param lng longitude of the car
     * @param lat latitude of the car
     */
    jump(lng, lat){

        var data = {"geometry": {"type": "Point", "coordinates": [lng, lat]}, "type": "Feature", "properties": {}};
        this.carCoords = data;
        

        var centre = this.getMapCenter(lng, lat); // détermination des coordonnées du circuit
        var longitude_centre = centre[0];
        var latitude_centre = centre[1];

        this.map.jumpTo({center:[longitude_centre, latitude_centre]}); // mise à jour de l'affichage du circuit
    }

    /**
     * Sets the route to show on the map
     * 
     * @param data a string that represents an array of point
     */
    setCircuit(data: string){

        var coordinates = eval(data);
        
        var surcharge = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                //ajoute des points sur la carte
                "coordinates": coordinates
            }
        };

        this.circuit = surcharge;
    }

    /**
     * Convert the gps position to the decimal format
     * 
     * @param degrees number of degrees
     * @param minutes number of minutes
     * @param seconds number of seconds
     * @param direction orientation
     * 
     * @returns the decimal value of the coordinate
     */
    conversion_gps(degrees: number, minutes: number, seconds: number, direction: string): number {
    
        var dd = degrees + minutes/60 + seconds/(60*60); // convertion des coordonnées en décimale
    
        if (direction == "S" || direction == "O") {
            dd = dd * -1; // ajout de l'orientation
        }
    
        return dd;
    }
    
    /**
     * Returns the distance from a point
     * 
     * @param centre center of a circuit
     * @param longitude_voiture longitude of the car
     * @param latitude_voiture latitude of the car
     * 
     * @returns the distance from a point
     */
    getDistance(centre: Array<number>, longitude_voiture: number, latitude_voiture: number): number{
    
        // lecture des coordonnées du centre
        var longitude_centre = centre[0];
        var latitude_centre = centre[1];
    
        // calcul des ecarts
        var d_longitude = Math.abs(longitude_centre - longitude_voiture);
        var d_latitude = Math.abs(latitude_centre - latitude_voiture);
    
        // calcul de la distance
        var distance = Math.sqrt(d_longitude * d_longitude + d_latitude * d_latitude);
    
        return distance;
    }
    
    /**
     * Returns the number of the closest circuit
     * 
     * @param distances an array of distance between the car and circuits
     * 
     * @returns the number of the closest circuit
     */
    getMin(distances: Array<number>): number{
    
        // valeur de départ
        var distance_min = distances[0];
        var num_centre = 0;
        var num = -1;
    
        distances.forEach(distance => {
            num++;
            if(distance < distance_min){
                distance_min = distance; // nouvelle distance min
                num_centre = num; // nouveau numéro du centre le plus proche
            }
        });
    
        return num_centre;
    }
    
    /**
     * Returns the center of the closest circuit
     * 
     * @param longitude longitude of the car
     * @param latitude latitude of the car
     * 
     * @returns the center of the closest circuit
     */
    getMapCenter(longitude: number, latitude: number): Array<number>{
    
        // coordonnées des circuits
        var londres = [-0.010547, 51.540801];
        var geoparc = [6.916125, 48.302109];
        var brooklands = [-0.468561, 51.351465];
        var polytech = [6.187861, 48.659408];
        var piste_cyclable = [5.897538, 48.659356];
        var ecluse = [5.872255, 48.677111];
        var mini_stade = [5.896471, 48.676752];
        var stade_arsenal = [5.889234, 48.680174];
        var blida = [6.18437363, 49.12671784];
    
        var centres = [londres, geoparc, brooklands, polytech, piste_cyclable, ecluse, mini_stade, stade_arsenal, blida]; // listes des circuits
    
        var distances = []; // liste des distances
    
        centres.forEach(centre => {
            var distance = this.getDistance(centre, longitude, latitude); // calcul de la distance
            distances.push(distance); // ajout de la distance à la liste
        });
    
        var num_centre = this.getMin(distances); // récuperations du circuit le plus proche
        return centres[num_centre];
    }
}

/**
 * MapS is an extension of the class Map that allows to signals points on the map
 */
export class MapS {
    
    /**
     * Mapbox gl representation of a map
     */
    map: mapboxgl.Map;

    /**
     * Context of map display
     */
    context: any;

    /**
     * Constructor of the map
     * 
     * @param map a Map object
     */
    constructor(map: Map) {
        this.map = map.map;
    }
    
    /**
     * Load the map
     * 
     * @param context context of map display
     */
    load(context) {

        this.context = context;

        // création d'une liste de points
        context.points = {
            "type": "FeatureCollection",
            "features": []
        };

        // fonction executé lors du chargement de la carte
        this.map.on('load', function(){
        
            // ajout de la source "points"
            this.addSource('points', {
                "type": "geojson",
                "data": context.points
            });
            
            // ajout d'une surchage "points"
            this.addLayer({
                "id": "points",
                "type": "circle",
                "source": "points",
                "paint": {
                    "circle-radius": 10,
                    'circle-color': ['get', 'color']
                },
                filter: ['in', '$type', 'Point']
            });
        
        });
        
        // fonction executé lors d'un clique sur la carte
        this.map.on('click', function(e) {
        
            // séléction du point cliqué
            var features = this.queryRenderedFeatures(e.point, { layers: ['points'] });
        
            if (features.length) { // si un point est selectioné
        
                var id = features[0].properties.id; // lecture de l'id du point
        
                // conservation des autres points
                // context.points.features = context.points.features.filter(point => point.properties.id !== id);
                context.socket.removeSignal(id);
        
            } else {
        
                var id: any = new Date().getTime();
                var lng = this.point.lng; // lecture de la longiude
                var lat = this.point.lat; // lecture de la latitude
                // var type = $("input[name='probleme']:checked"). val(); // lecture du type de probleme
                var type = "bouchon";

                var point = {"id": id, "lng": lng, "lat": lat, "type": type};
                
                context.socket.signalOnMap(point);
        
            }
            
            
            //envoie(); // envoi de la liste des points au serveur
        });
        
        // fonction executé lorsque le curseur bouge
        this.map.on('mousemove', function (e) {
        
            this.point = e.lngLat; // lecture des coordonnées du points
        
        });
        
        
        
        // creation d'un popup
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
    }
    
    /**
     * Add a point on the map
     * 
     * @param point informations about the signal
     */
    addPoint(point: any){
        
        //choix de la couleur
        if (point.type == "bouchon"){
            var couleur = "#f00";
        }
        else{
            var couleur = "#fa0";
        }
    
    
        // création du json du point
        var geojson = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [point.lng, point.lat]
            },
            "properties": {
                "id": point.id,
                "description": point.type,
                "color": couleur
            }
        };
        
        this.context.points.features.push(geojson); // ajout du point à la liste
        this.context.mapS.map.getSource('points').setData(this.context.points); // mise à jour de l'affichage
    }

    /**
     * Remove a signal
     * 
     * @param id id of the signal
     */
    removePoint(id){
        this.context.points.features = this.context.points.features.filter(point => point.properties.id !== String(id));
        this.context.mapS.map.getSource('points').setData(this.context.points); // mise à jour de l'affichage
    }
}

/**
 * Circuit is an extension of the class Map that allows to edit the route to show on th emap
 */
export class Circuit {

    /**
     * Mapbox gl representation of a map
     */
    map: mapboxgl.Map;

    /**
     * mapbox access token
     */
    accessToken = 'pk.eyJ1IjoibWVoZGllbG1hZGtvdXIiLCJhIjoiY2pvNWl3eDVlMDdnbTNxbzA1bmM5MG1zeSJ9.yIWUXIiEktMlPrWV2RIxMA';

    /**
     * position of the car
     */
    carCoords = {"geometry": {"type": "Point", "coordinates": [-0.467984, 51.350344]}, "type": "Feature", "properties": {}};
    
    /**
     * Context of map display
     */
    context: any;

    /**
     * List of points to form the route
     */
    coordinates: Array<Array<number>> = [];

    /**
     * Load the map
     */
    load(){
        
        var context = this;

        //accès à la carte
        Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(this.accessToken);
        
        var context = this;

        //charge la carte
        this.map = new mapboxgl.Map({

            //parametre de la carte
            container: 'map', // element contenant la carte
            style: 'mapbox://styles/mehdielmadkour/cjo5jaot80n1p2sq8wckp7vdl', // adresse de la carte en ligne
            center: [-0.467503, 51.351400], // definition du centre par défaut
            zoom: 13.9, // définition de l'echelle
            interactive: true // possibilité d'interaction avec la carte
        });

        var points = null;

        

        // création d'une liste de points reliés entre eux
        var surcharge = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                //ajoute des points sur la carte
                "coordinates": this.coordinates
            }
        };
        
        // attente du chargement de la carte
        this.map.on('load', function(){

            this.addSource('circuit', {
                "type": "geojson",
                "data": surcharge
            });

            // circuit brooklands
            this.addLayer({
                "id": "route",
                "type": "line",
                "source": "circuit",

                //trace des droites entre les points
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },

                //colorie les droites
                "paint": {
                    "line-color": "#3887be",
                    "line-width": 6
                }
            });
        });

        function addCoordinates(lng, lat){

            surcharge.geometry.coordinates.push([lng, lat]); // ajout d'un point aux coordonnées indiqués

        }

        // fonction executé lors d'un clique sur la carte
        this.map.on('click', function(e) {

            var lng = e.lngLat.lng; // lecture de la longiude
            var lat = e.lngLat.lat; // lecture de la latitude
            
            addCoordinates(lng, lat); // ajout du point

            this.getSource('circuit').setData(surcharge); // mise à jour de l'affichage
        });
    }
}