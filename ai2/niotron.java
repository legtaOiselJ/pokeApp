package com.legta.pokeapp;

import android.app.Activity;
import android.content.Context;
import com.google.appinventor.components.annotations.*;
import com.google.appinventor.components.common.ComponentCategory;
import com.google.appinventor.components.runtime.AndroidNonvisibleComponent;
import com.google.appinventor.components.runtime.ComponentContainer;
import com.google.appinventor.components.runtime.EventDispatcher;
import com.google.appinventor.components.runtime.util.YailList;
import com.google.appinventor.components.runtime.util.YailDictionary;
import com.google.appinventor.components.runtime.util.JsonUtil;

import com.google.appinventor.components.runtime.Clock;
import com.google.appinventor.components.runtime.Sprite;
import com.google.appinventor.components.runtime.ImageSprite;

import com.google.appinventor.components.runtime.WebViewer;

import org.json.*;
import java.util.*;
import java.lang.Math;
import java.lang.Boolean;

@DesignerComponent(
        version = 1,
        description = "AI2 extension pour le TP pokeApp",
        category = ComponentCategory.EXTENSION,
        nonVisible = true,
        iconName = "")

@SimpleObject(external = true)
//Libraries
@UsesLibraries(libraries = "")
//Permissions
@UsesPermissions(permissionNames = "")

public class legtaUtils extends AndroidNonvisibleComponent {

    //Activity and Context
    private Context context;
    private Activity activity;
    
    private Clock spriteAnimationClock;
    private boolean isAvatarMoving;

    private float avatarPixelSpeed;
    private ImageSprite spriteAvatar;

    private int spritesheetIndex;
    
    private YailList upOrientationImagesList;
    private YailList downOrientationImagesList;
    private YailList leftOrientationImagesList;
    private YailList rightOrientationImagesList;

    private JSONObject jsonMedias;
    private JSONObject jsonColors;

    public legtaUtils(ComponentContainer container){

        super(container.$form());

        this.activity = container.$context();
        this.context = container.$context();

        this.isAvatarMoving = false;

        this.spritesheetIndex = 0;
        this.avatarPixelSpeed = 3;

    }

    // ============================= medias

    @SimpleFunction (description = "Decodes the JSON text into Dictionary blocks.")
    public void EnregistrerCouleurs( String texte ) {
        this.jsonColors = new JSONObject(texte);
    }
    

    @SimpleFunction (description = "Decodes the JSON text into Dictionary blocks.")
    public void EnregistrerMedias( String texte ) {
        this.jsonMedias = new JSONObject(texte);
    }
    
    @SimpleFunction( description = "obtenir les url des différents medias" )
    public void ObtenirMedias( int index ){

        try{

            if( this.jsonMedias != null ){

                JSONObject pkmnUrls = this.jsonMedias.getJSONObject( Integer.toString(index) );

                String icon_path = pkmnUrls.getString("icon");
                String pokedex_path = pkmnUrls.getString("pokedex");
                String front_path = pkmnUrls.getString("front");
                String back_path = pkmnUrls.getString("back"); 
                String crie_path = pkmnUrls.getString("crie");

                this.MediasObtenus( icon_path, pokedex_path, front_path, back_path, crie_path );
            }

        }catch( Exception e ) {

            String exceptionString = e.toString();
            this.XError(exceptionString);

        }

    }


    @SimpleFunction(description = "obtenir une liste RGB")
    public YailList ObtenirCouleurRGB( String type ) {

        String downCaseType = type.toLowerCase();

        List<Integer> blackColorList = new ArrayList<>();

        blackColorList.add( 0 );     
        blackColorList.add( 0 );  
        blackColorList.add( 0 );  

        YailList outBlackList = YailList.makeList(blackColorList);

        try{

            if( this.jsonColors != null ){

                JSONObject colorObj = this.jsonColors.getJSONObject( downCaseType );

                List<Integer> colorsList = new ArrayList<>();

                colorsList.add( Integer.parseInt( colorObj.getString( "red" ) ) );     
                colorsList.add( Integer.parseInt( colorObj.getString( "green" ) ) );  
                colorsList.add( Integer.parseInt( colorObj.getString( "blue" ) ) );  

                YailList outList = YailList.makeList(colorsList);
       
                return outList;

            }

        }catch( Exception e ) {

            String exceptionString = e.toString();
            this.XError(exceptionString);

        }

        return outBlackList;

    }


    // ============================= avatar

    @SimpleFunction(description = "enregistrement de l'avatar")
    public void EnregistrerAvatar(
        ImageSprite avatar,
        YailList liste_imagesOrientationHaut,
        YailList liste_imagesOrientationBas,
        YailList liste_imagesOrientationGauche,
        YailList liste_imagesOrientationDroite,
        Clock horlogeAnimation,
        int frequenceImages,
        float vitessePixelAvatar 
    ){
        
        this.spriteAvatar = avatar;
        this.upOrientationImagesList = liste_imagesOrientationHaut;
        this.downOrientationImagesList = liste_imagesOrientationBas;
        this.leftOrientationImagesList = liste_imagesOrientationGauche;
        this.rightOrientationImagesList = liste_imagesOrientationDroite;

        this.spriteAnimationClock = horlogeAnimation;
        this.spriteAnimationClock.TimerInterval( frequenceImages );
        
        this.avatarPixelSpeed = vitessePixelAvatar;
    
    }

    

    @SimpleFunction(description = "obtenir la liste d'images affichant l'orientation")
    private YailList getAvatarSpritePathList( double heading ) {

        if( Double.compare(heading, 180) == 0 ){

            return this.leftOrientationImagesList;

        }else if(Double.compare(heading, 0) == 0 ){

            return this.rightOrientationImagesList;

        }else if(Double.compare(heading, 270) == 0){

            return this.downOrientationImagesList;

        }else {

            return this.upOrientationImagesList;

        }

    }

    @SimpleFunction(description = "cette procédure permet d'orienter l'avatar en fonction de la position d'un click sur le Canvas" )
    public void OrienterAvatar_CanvasInteraction(float touch_x, float touch_y){

        double updateHeading = 0;

        double delta_x = this.spriteAvatar.X() - touch_x;
        double delta_y = this.spriteAvatar.Y() - touch_y;

        if( Math.abs( delta_x ) > Math.abs( delta_y) ){

            if( delta_x > 0 ){
                updateHeading = 180;
            }else{
                updateHeading = 0;
            }

        }else{
            if( delta_y > 0){

                updateHeading = 90;

            }else{

                updateHeading = 270;

            }
        }

        this.OrienterAvatar( updateHeading );

    }



    @SimpleFunction(description = "actualiser l'aspect visuel de l'avatar")
    public void ActualiserAvatar() {
        
        try{
            double currentHeading = this.spriteAvatar.Heading();
            YailList spriteList = this.getAvatarSpritePathList( currentHeading );
            
            if( spriteList.size() > 0 ){

                if( !this.isAvatarMoving ){

                    this.spritesheetIndex = 0;

                }else{

                    if(  this.spritesheetIndex < spriteList.size() - 1 ){

                        this.spritesheetIndex = this.spritesheetIndex + 1;

                    }else{

                        this.spritesheetIndex = 0;

                    }

                }

                String frame_path = spriteList.getString( this.spritesheetIndex );

                this.spriteAvatar.Picture(frame_path);
            }

        }catch( Exception e ) {
                String exceptionString = e.toString();
                this.XError(exceptionString);
        }

    }


    @SimpleFunction(description = "actualiser l'orientation de l'avatar")
    public void OrienterAvatar( double direction ) {

        this.spritesheetIndex = 0;
        this.spriteAvatar.Heading( direction );

        this.ActualiserAvatar();

    }


    @SimpleFunction(description = "inverse l'orientation de l'avatar de 180°")
    public void EvaluerCollisionAvecAvatar( Sprite other ) {

        if( this.spriteAvatar != null ){

            if( this.spriteAvatar == other ){
            
                double currentHeading = this.spriteAvatar.Heading();
                double updateHeading = 0;

                if( Double.compare(currentHeading, 180) == 0 ){

                    updateHeading = 0;

                }else if( Double.compare(currentHeading, 0) == 0 ){
                    
                    updateHeading = 180;
                
                }else if( Double.compare(currentHeading, 90) == 0 ){
                    
                    updateHeading = 270;
                
                }else{

                    updateHeading = 90;

                }

                this.OrienterAvatar(updateHeading);

                this.AvancerAvatar();

            }
        }

    }


    @SimpleFunction(description = "mettre en mouvement l'avatar")
    public void AvancerAvatar() {

        try{

            if( this.spriteAvatar != null && !this.isAvatarMoving ){
                
                this.isAvatarMoving = true;
                
                this.spriteAvatar.Enabled(true);
                this.spriteAvatar.Speed(avatarPixelSpeed);

                this.spriteAnimationClock.TimerEnabled(true);
            
            }
        }catch( Exception e ) {
            String exceptionString = e.toString();
            this.XError(exceptionString);
        }


    }

    @SimpleFunction(description = "stopper le mouvement de l'avatar")
    public void StopperAvatar() {

        try{

            if( this.spriteAvatar != null && this.isAvatarMoving ){
                
                this.isAvatarMoving = false;
                
                this.spriteAvatar.Enabled(false);
                this.spriteAvatar.Speed(0);

                this.ActualiserAvatar();

                this.spriteAnimationClock.TimerEnabled(false);

            }

        }catch( Exception e ) {
            String exceptionString = e.toString();
            this.XError(exceptionString);
        }
        
    }


    // ============================= combats

    @SimpleFunction( description = "Initialisation de la page combat")
    public void CombatDebut( 
        WebViewer webview,
        YailList gameplay,
        YailList pkmn_joueur_stats, 
        YailList pkmn_joueur_actions,
        YailList pkmn_sauvage_stats,
        YailList pkmn_sauvage_actions
        ){

            try{            
                
                String[] strGameplay = gameplay.toStringArray();

                JSONObject jsonContainer = new JSONObject();

                JSONObject playerStats = new JSONObject();
                playerStats.put("stats", pkmn_joueur_stats.toJSONString());
                playerStats.put("moves", pkmn_joueur_actions.toJSONString());
                playerStats.put("xp", strGameplay[8]);

                JSONObject wildStats = new JSONObject();
                wildStats.put("stats", pkmn_sauvage_stats.toJSONString());
                wildStats.put("moves", pkmn_sauvage_actions.toJSONString());
        
                jsonContainer.put("room", strGameplay[0] );
            
                jsonContainer.put("player", playerStats );
                jsonContainer.put("wild", wildStats );

                String webviewStr = jsonContainer.toString();

                webview.WebViewString( webviewStr  );
                String jsCmd = "window.JEU.AI2start();";

                webview.RunJavaScript(jsCmd);


            }catch( Exception e ) {
                String exceptionString = e.toString();
                this.XError(exceptionString);
            }
      
    }



    /*@SimpleEvent(description = "raw debug func")
    public void DebugVal( 
        String val
    ){

        EventDispatcher.dispatchEvent(this, "DebugVal",val );

    }*/


    @SimpleFunction(description = "Traitement du webviewstring object")
    public void ReceptionMessageGlitch( String webviewString ){

        try{

            JSONObject jsonGlitch = new JSONObject(webviewString);

            String cmd = jsonGlitch.getString("cmd");

            int index = jsonGlitch.getInt("index");
            int level = jsonGlitch.getInt("level");
            int xp = jsonGlitch.getInt("xp");

            this.CombatFin( cmd, index, level, xp );

        }catch( Exception e ) {

            String exceptionString = e.toString();
            this.XError(exceptionString);

        }


    }


    // ============================= events


    @SimpleEvent(description = "Test Event Generated by Niotron")
    public void MediasObtenus( 
        String icon, 
        String pokedex, 
        String front,
        String back,
        String cri
    ){

        EventDispatcher.dispatchEvent(this, "MediasObtenus", icon, pokedex, front, back, cri );

    }


    @SimpleEvent(description = "Evenement de fin de combat")
    public void CombatFin( 
        String commande, 
        int index, 
        int niveau,
        int experience
    ){

        EventDispatcher.dispatchEvent(this, "CombatFin", commande, index, niveau, experience );

    }


    @SimpleEvent(description = "get aix error value")
    public void XError( 
        String value
    ){

        EventDispatcher.dispatchEvent(this, "XError", value );

    }


    // old functions 
    /*@SimpleFunction (description = "Decodes the JSON text into Dictionary blocks.")
    private YailDictionary txtToDict( String jsonTxt ) {

        JSONObject jsonObject = new JSONObject(jsonTxt);
        testDict = JsonUtil.getDictionaryFromJsonObject(jsonObject);
        return testDict;

    }*/

        /*@SimpleFunction(description = "contrôler les collisions")
    private boolean CheckForCollisions(){

        for( int i = 0; i < this.obstaclesList.size(); i++){
            ImageSprite obstacle = this.obstaclesList.getObject( i );
            if( this.spriteAvatar.CollidingWith( obstacle ) ){
                return true;
            }
        }

        return false;

    }*/


}
