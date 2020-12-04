/**
 * DataTable is the class that create a table containing informations about the car
 */
export class DataTable {

    /**
     * Returns the dimensions of the table
     * 
     * @param len the number of informations
     * 
     * @returns the dimensions of the table
     */
    getTabSize(len: number): Array<number>{

        // définition du format en fonction du nombre d'élement

        var tab: Array<number>;

        if (len <= 4){
            tab = [1, 4];
        }
        else if (len <= 8){
            tab = [2, 4];
        }
        else if (len <= 12){
            tab = [3, 12];
        }
        else {
        tab = [4, 12];
        }

        return tab;
    }
    
    /**
     * Create a new table
     * 
     * @param data an array of informations
     * @param nb_ligne the number of line
     * @param nb_colonne the number of column
     * 
     * @returns the html text of the table
     */
    newTab(data: Array<string>, nb_ligne: number, nb_colonne: number): string{
        
        var txt = '';
        for (let i = 0; i < nb_ligne; i++){
            var offset = i * nb_colonne; // indice du début de la ligne
            length = (i + 1) * nb_colonne; // indice de fin de la ligne
    
            var dataLine = data.slice(offset, length); // récuperation de la ligne de données
            txt = txt + this.newLine(nb_colonne, dataLine); // ajout d'une ligne dans le tableau
        }

        return txt;
    }
    
    /**
     * Add a new line
     * 
     * @param len the number of information in the line
     * @param data an array of informations
     * 
     * @returns the html text of the line
     */
    newLine(len: number, data: Array<string>): string{

        var txt = '<div class="row">'; // ouverture d'une nouvelle ligne pour le titre
        for (var i = 0; i < len; i++){
            txt = txt + this.addCard(data[i]); // ajout d'une colonne pour le titre
        }
        txt = txt + "</div>"; // fermeture de la ligne
    
        return txt;
    }
        
    /**
     * Add a new column in the line
     * 
     * @param data the information informations
     * 
     * @returns the html text of the line
     */
    addCard(data: string): string{

        var txt = '';
        if (data != "vide"){ // vérification du contenu
            
            // remplace les _ par des espaces
            var array = data.split("_");
            var title = array.join(" ");


            txt = '<div class="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">'; // ouverture d'une colonne
            txt = txt + '<div class="card mb-4">'; // ouverture d'une carte
                txt = txt + '<mat-card-title text-muted text-center"><small>' + title + '</small></mat-card-title>';
                txt = txt + '<mat-card>'; // ouverture du corps de la carte
                // txt = txt + '<div class="card-img-top"><fa-icon [icon]=="' + icon + '"></fa-icon></div>'; // ajout du titre
                txt = txt + '<mat-card-content align="center" id="' + data + '">0</mat-card-content>'; // ajout de la donnée
                txt = txt + '</mat-card>'; // fermeture du corps de la carte
            txt = txt + '</div>'; // fermeture de la carte
            txt = txt + '</div>'; // fermeture de la colonne
        
        }

        return txt;
    }
    
    /**
     * Fill the table with empty cases
     * 
     * @param data the array of information
     * @param nb_vide the number of remaining case
     * 
     * @returns the table filled with empty cases
     */
    fillTab(data: Array<string>, nb_vide: number): Array<string>{
        for (var i = 0; i < nb_vide; i++){
            data.push("vide"); // rempli la liste pour qu'elle corresponde au format du tableau
        }
        return data;
    }
    
    /**
     * Create a new table
     * 
     * @param data an array of information
     * 
     * @returns the html text of the table
     */
    generTab(data: Array<string>): string{
        var len = data.length; // nombre d'élément
        var TabSize = this.getTabSize(len); // récupération de la taille du tableau
        var nb_ligne = TabSize[0]; // lecture du nombre de ligne
        var nb_colonne = TabSize[1]; // lecture du nombre de colonne
        
        var nb_vide = nb_colonne * nb_ligne - len; // calcul le nombre de case vide
        if (nb_vide > 0){
            data = this.fillTab(data, nb_vide); // rempli la liste
        }
    
        return this.newTab(data, nb_ligne, nb_colonne); // création du tableau
    }
}
