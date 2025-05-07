
class PKMN{
  
    constructor( isAWildPokemon = true ){
        
        this.HasAttacked = false; 
        
        this.animation_classes = {
            enter : isAWildPokemon ? "slide-in-blurred-right" : "slide-in-blurred-left",
            exit : "slide-out-bck-center",
            attack : "bounce-top",
            no_attack : "jello-horizontal",
            hit : "wobble-hor-bottom"
        };
  
        this.isAWildPokemon = isAWildPokemon;
  
        this.isPokemonFainted = false;
        
        this.pokemonDatas = {
          
          pokeapi : {
              db : "https://pokeapi.co/api/v2",
              datas : null, 
              specie : null
          },
          tyradex : {
            db :"https://tyradex.vercel.app/api/v1",
            datas: null
          }
  
        };
        
        this.stats = {};
        this.moves = [];
  
        this.specials_moves = [
            "Eau",
            "Plante",
            "Feu",
            "Glace",
            "Electrique",
            "Psy",
            "Dragon",
            "Ténèbres"
        ];
  
        this.docElements = {};
  
        this.attributeElements();
        
    }   
  
  
  
    attributeElements(){
        
        this.docElements = {
            mainContainer : document.getElementById(this.isAWildPokemon ? "wildMainContainer" : "playerMainContainer" ),
            name : document.getElementById( this.isAWildPokemon ? 'wildName' : 'playerName'),
            healthbar : {
                doc : document.getElementById( this.isAWildPokemon ? 'wildHP' : 'playerHP' ),
                class : 'p100'
            },
            pokemon : {
                container : document.getElementById( this.isAWildPokemon ? "wildPkmn" : "playerPkmn" ),
                crie : document.getElementById( this.isAWildPokemon ? "wildCrie" : "playerCrie" ),
                hit : document.getElementById( this.isAWildPokemon ? "wildFX" : "playerFX" ),
                sprite : document.getElementById( this.isAWildPokemon ? "wildSprite" : "playerSprite" )
            },
            moves : {
                name : document.getElementById("MoveName"),
                resistance :document.getElementById("MoveEfficacity")
            },
            panels : {
                beforeMove : document.getElementById("beforeMove"),
                afterMove : document.getElementById("afterMove")
            }
  
  
        }
  
      
    }
  
  
    attributesStats( base_stats, startExperience ){
      
        const {
            isAWildPokemon,
            docElements,
            stats
        } = this;
        
        return new Promise((resolve, reject) => {
  
          try {
            
            
            if( stats.length <= 0) resolve(false);
            
                    
            this.docElements.pokemon.hit.src = window.FX;
            
            let src_index = parseInt(base_stats[ 1 ]);
            
            stats.level = parseInt(base_stats[ 0 ]);
            stats.index = src_index; 
          
            stats.name = base_stats[ 2 ];
            
            if(!isAWildPokemon){
              
              let pkmnCmd = document.getElementById("pkmnCmd");
              pkmnCmd.innerHTML = `Que doit faire <b>${stats.name}</b> ?`;
            
            }
            
            stats.types = {
                type_1: base_stats[ 3 ],
                type_2: base_stats[ 4 ]
            };
            
            stats.resistances = this.get_resistances(base_stats[ 6 ], base_stats[ 7 ]);
            
            stats.health = {
                active :  parseInt(base_stats[ 5 ]),
                full :  parseInt(base_stats[ 5 ]),
                level : 100
            };
            
            stats.attack = {
                base :  parseInt(base_stats[ 6 ]),
                spe :  parseInt(base_stats[ 7 ])
            };
            
            stats.defense = {
                base :  parseInt(base_stats[ 8 ]),
                spe :  parseInt(base_stats[ 9 ])
            };
    
            stats.speed = base_stats[ 10 ];
            
  
            
            let medias = window.mediasURL[ src_index ];
  
            docElements.pokemon.sprite.src = isAWildPokemon ? medias.front : medias.back;
  
            docElements.pokemon.crie.src = medias.crie;
          
            stats.experience = stats.level *  parseInt(base_stats[ 11 ]);
            
            if(!isAWildPokemon ){
              
              if( startExperience > 0) stats.experience = startExperience;
              
              this.get_pokemon_details();
              
            }
            
            resolve(true);
        
          }catch(e){
  
            console.log("failed to associate stats")
            console.log(e);
  
            reject(false);
            
          };
          
        } );
  
    }
    
    get_pokemon_details(){
      
      const {
        stats,
        pokemonDatas
      } = this; 
      
          fetch(`${pokemonDatas.pokeapi.db}/pokemon/${stats.index}`)
            .then( ( response ) => response.json() )
            .then( (jsonObject ) => {
  
                pokemonDatas.pokeapi.datas = jsonObject;
                
                this.get_specie_details();
  
              
        } );  
    }
  
  
    get_specie_details(){
      
      const {
        pokemonDatas,
        stats
      } = this;
      
      fetch(`${pokemonDatas.pokeapi.db}/pokemon-species/${stats.index}`)
      .then((response) => response.json())
      .then( (jsonObject) => {
  
          pokemonDatas.pokeapi.specie = jsonObject;
          stats.growthRate = jsonObject.growth_rate.name;
  
          this.get_tyradex_details();
  
      } );
  
    }
  
    get_resistances(){
  
        const {
            stats
        } = this;
  
        const resistanceTable = {
            Acier : {
                Acier : 0.5,
                Combat : 2,
                Dragon : 0.5,
                Eau : 1,
                Electrique : 1,
                Fée : 0.5,
                Feu : 2,
                Glace : 0.5,
                Insecte : 0.5,
                Normal : 0.5,
                Plante : 0.5,
                Poison : 0,
                Psy : 0.5,
                Roche : 0.5,
                Sol : 2,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 0.5
            },
            Combat : {
                Acier : 1,
                Combat : 1,
                Dragon : 1,
                Eau : 1,
                Electrique : 1,
                Fée : 2,
                Feu : 1,
                Glace : 1,
                Insecte : 0.5,
                Normal : 1,
                Plante : 1,
                Poison : 1,
                Psy : 2,
                Roche : 0.5,
                Sol : 1,
                Spectre : 1,
                Ténèbres : 0.5,
                Vol : 2
            },
            Dragon : {
                Acier : 1,
                Combat : 1,
                Dragon : 2,
                Eau : 0.5,
                Electrique : 0.5,
                Fée : 2,
                Feu : 0.5,
                Glace : 2,
                Insecte : 0.5,
                Normal : 1,
                Plante : 0.5,
                Poison : 1,
                Psy : 1,
                Roche : 1,
                Sol : 1,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 1
            },
            Eau : {
                Acier : 0.5,
                Combat : 1,
                Dragon : 1,
                Eau : 0.5,
                Electrique : 2,
                Fée : 1,
                Feu : 0.5,
                Glace : 0.5,
                Insecte : 1,
                Normal : 1,
                Plante : 2,
                Poison : 1,
                Psy : 1,
                Roche : 1,
                Sol : 1,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 1
            },
            Electrique : {
                Acier : 0.5,
                Combat : 1,
                Dragon : 1,
                Eau : 1,
                Electrique :0.5,
                Fée : 1,
                Feu : 1,
                Glace : 1,
                Insecte : 1,
                Normal : 1,
                Plante : 1,
                Poison : 1,
                Psy : 1,
                Roche : 1,
                Sol : 2,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 0.5
            },
            Fée : {
                Acier : 2,
                Combat : 0.5,
                Dragon : 0,
                Eau : 1,
                Electrique :1,
                Fée : 1,
                Feu : 1,
                Glace : 1,
                Insecte : 0.5,
                Normal : 1,
                Plante : 1,
                Poison : 2,
                Psy : 1,
                Roche : 1,
                Sol : 1,
                Spectre : 1,
                Ténèbres : 0.5,
                Vol : 1
            },
            Feu : {
                Acier : 0.5,
                Combat : 1,
                Dragon : 1,
                Eau : 2,
                Electrique :1,
                Fée : 0.5,
                Feu : 0.5,
                Glace : 0.5,
                Insecte : 0.5,
                Normal : 1,
                Plante : 0.5,
                Poison : 1,
                Psy : 1,
                Roche : 2,
                Sol : 2,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 1
            },
            Glace : {
                Acier : 2,
                Combat : 2,
                Dragon : 1,
                Eau : 1,
                Electrique :1,
                Fée : 1,
                Feu : 2,
                Glace : 0.5,
                Insecte : 1,
                Normal : 1,
                Plante : 1,
                Poison : 1,
                Psy : 1,
                Roche : 2,
                Sol : 1,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 1
            },
            Insecte : {
                Acier : 1,
                Combat : 0.5,
                Dragon : 1,
                Eau : 1,
                Electrique :1,
                Fée : 1,
                Feu : 2,
                Glace : 1,
                Insecte : 1,
                Normal : 1,
                Plante : 0.5,
                Poison : 1,
                Psy : 1,
                Roche : 2,
                Sol : 0.5,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 2
            },
            Normal : {
                Acier : 1,
                Combat : 2,
                Dragon : 1,
                Eau : 1,
                Electrique :1,
                Fée : 1,
                Feu : 1,
                Glace : 1,
                Insecte : 1,
                Normal : 1,
                Plante : 1,
                Poison : 1,
                Psy : 1,
                Roche : 1,
                Sol : 1,
                Spectre : 0,
                Ténèbres : 1,
                Vol : 2
            },
            Plante : {
                Acier : 1,
                Combat : 1,
                Dragon : 1,
                Eau : 0.5,
                Electrique :0.5,
                Fée : 1,
                Feu : 2,
                Glace : 2,
                Insecte : 2,
                Normal : 1,
                Plante : 0.5,
                Poison : 2,
                Psy : 1,
                Roche : 1,
                Sol : 0.5,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 2,
            },
            Poison:{
                Acier : 1,
                Combat : 0.5,
                Dragon : 1,
                Eau : 1,
                Electrique :1,
                Fée : 0.5,
                Feu : 1,
                Glace : 1,
                Insecte : 0.5,
                Normal : 1,
                Plante : 0.5,
                Poison : 0.5,
                Psy : 2,
                Roche : 1,
                Sol : 2,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 1
            },
            Psy : {
                Acier : 1,
                Combat : 0.5,
                Dragon : 1,
                Eau : 1,
                Electrique :1,
                Fée : 1,
                Feu : 1,
                Glace : 1,
                Insecte : 2,
                Normal : 1,
                Plante : 1,
                Poison : 1,
                Psy : 0.5,
                Roche : 1,
                Sol : 1,
                Spectre : 2,
                Ténèbres : 2,
                Vol : 1
            },
            Roche : {
                Acier : 2,
                Combat : 2,
                Dragon : 1,
                Eau : 2,
                Electrique :1,
                Fée : 1,
                Feu : 0.5,
                Glace : 1,
                Insecte : 1,
                Normal : 0.5,
                Plante : 2,
                Poison : 0.5,
                Psy : 1,
                Roche : 1,
                Sol : 2,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 0.5,
            },
            Sol : {
                Acier : 1,
                Combat : 1,
                Dragon : 1,
                Eau : 2,
                Electrique :0,
                Fée : 1,
                Feu : 1,
                Glace : 2,
                Insecte : 1,
                Normal : 1,
                Plante : 2,
                Poison : 0.5,
                Psy : 1,
                Roche : 0.5,
                Sol : 1,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 1
            },
            Spectre : {
                Acier : 1,
                Combat : 0,
                Dragon : 1,
                Eau : 1,
                Electrique :1,
                Fée : 1,
                Feu : 1,
                Glace : 1,
                Insecte : 0.5,
                Normal : 0,
                Plante : 1,
                Poison : 0.5,
                Psy : 1,
                Roche : 1,
                Sol : 1,
                Spectre : 2,
                Ténèbres : 2,
                Vol : 1
            },
            Ténèbres: {
                Acier : 1,
                Combat : 2,
                Dragon : 1,
                Eau : 1,
                Electrique :1,
                Fée : 2,
                Feu : 1,
                Glace : 1,
                Insecte : 2,
                Normal : 1,
                Plante : 1,
                Poison : 1,
                Psy : 0,
                Roche : 1,
                Sol : 1,
                Spectre : 0.5,
                Ténèbres : 0.5,
                Vol : 1
            },
            Vol : {
                Acier : 1,
                Combat : 0.5,
                Dragon : 1,
                Eau : 1,
                Electrique :2,
                Fée : 1,
                Feu : 1,
                Glace : 2,
                Insecte : 0.5,
                Normal : 1,
                Plante : 1,
                Poison : 1,
                Psy : 1,
                Roche : 2,
                Sol : 0,
                Spectre : 1,
                Ténèbres : 1,
                Vol : 1
            }
        
        };
  
        try{
            return [ resistanceTable[`${stats.types.type_1}`], resistanceTable[`${stats.types.type_2}`] ];
        }catch(e){
            console.log(`an error occured while affecting efficacity : ${e}`);
            return [];
        }
  
    }
    
  
    get_tyradex_details(){
      
      const {
        pokemonDatas,
        stats
      } = this;
      
      stats.evolution = {
        level : 101,
        index : stats.index
      };      
      
      fetch(`${pokemonDatas.tyradex.db}/pokemon/${stats.index}`)
      .then( ( response ) => response.json() )
      .then( ( jsonObject ) => {
  
          pokemonDatas.tyradex.datas = jsonObject;
          
          let evolutionChain = jsonObject.evolution.next;
        
          if( evolutionChain != null ){
            
            stats.evolution.level = parseInt(evolutionChain[0].condition.match(/\d+/)[0])
            stats.evolution.index = evolutionChain[0].pokedex_id;
  
          }
        
      });
      
    }
  

    getTotalXPForLevel(level, growthRate) {
      switch (growthRate) {
        case "fast":
          return Math.floor( (4 / 5) * Math.pow(level, 3) );
        case "medium-fast":
          return Math.pow(level, 3);
        case "medium-slow":
          return Math.floor((6 / 5) * Math.pow(level, 3) - 15 * Math.pow(level, 2) + 100 * level - 140);
        case "slow":
        default:
          return Math.floor((5 / 4) * Math.pow(level, 3));
      }
    }



    toNextLevel( gainXP ){
  
        const {
          stats,
          docElements
        } = this;
        
  
        /*let xpSum = stats.experience + gainXP;
        //let debugXP = `gainXP:${gainXP}, stats.experience: ${stats.experience}, xpSum:${xpSum}`;
      
        let experienceRequired = 0;
        
        switch ( stats.growthRate ) {
            
          case "fast":
            
            experienceRequired = Math.floor( 4/5 * Math.pow( stats.level, 3 ) );
            break;
            
          case "medium-fast":
            
            experienceRequired = Math.floor( Math.pow( stats.level, 3 ) );
            break;
            
          case "medium-slow":
            
            experienceRequired = Math.floor( 6/5 * Math.pow( stats.level, 3 ) - 15 * Math.pow( stats.level, 2 ) + 100*stats.level - 140 );
            break;
          
          case "slow":
            experienceRequired = Math.floor( 5/4 * Math.pow( stats.level, 3 ) );
            break;
          
          default:
            experienceRequired = Math.floor( 5/4 * Math.pow( stats.level, 3 ) );
            break;
        
        }
      
  
      
        let updateIndex = stats.index;
        let updateLevel = stats.level;
  
        if( xpSum >= experienceRequired ){
            
            window.audioElements.level.play();
  
            updateLevel = updateLevel + 1;
  
            if( stats.evolution.level <=  updateLevel ) updateIndex = stats.evolution.index;
  
        }
  */

        // XP total requis pour atteindre le niveau actuel (14)
      const currentLevelXP = this.getTotalXPForLevel(stats.level, stats.growthRate);

      // XP total requis pour atteindre le niveau suivant (15)
      const nextLevelXP = this.getTotalXPForLevel(stats.level + 1, stats.growthRate);

      // XP à atteindre depuis le niveau actuel pour monter de niveau
      const xpNeededToLevelUp = nextLevelXP - currentLevelXP;

      // xpSum correspond à l'XP accumulée DANS le niveau actuel
      let xpSum = stats.experience + gainXP;
      
      // Est-ce qu'on monte de niveau ?
      if (xpSum >= xpNeededToLevelUp) {

        updateLevel = updateLevel + 1;
        if (stats.evolution.level <= updateLevel) updateIndex = stats.evolution.index;

        xpSum=xpNeededToLevelUp-xpSum;

      }


      window.AI2Message.index = updateIndex;
      window.AI2Message.level = updateLevel;
      window.AI2Message.xp = xpSum;
      
    }
  
    get_experience_gain(){
        
      const {
            isAWildPokemon,
            stats
      } = this; 
  
      let wildeness = isAWildPokemon ? 1 : 1.25;
      let gain = Math.floor( stats.experience  / 7 * wildeness );

      return gain;
  
    }
  
    attributesMoves( base_moves ){
  
        const {
            moves
        } = this;
  
        if( base_moves.length <= 0) return;
  
        base_moves.forEach( move => {
  
            let move_stats = {
                power :  parseInt(move[ 0 ]),
                type : move[ 1 ],
                name : move[ 2 ],
                definition : move[ 3 ]
            }
            
            moves.push(move_stats);
  
        } );
  
  
    }
  
    get_move_resistance( move_type ){
      
        const {
            stats
        } = this;
        
        let move_efficacity_1 = stats.resistances[0][`${move_type}`] ?? 1;
        let move_efficacity_2 = stats.resistances[1][`${move_type}`] ?? 1;
  
        return move_efficacity_1 * move_efficacity_2;
    }
  
    get_speed(){
        return this.stats.speed;
  
    }
  
    isASpecialMove( selected_move ){
  
        const {
            specials_moves
        } = this;
  
        let result = false;
  
        specials_moves.every( move_type => {
  
            if( selected_move.type == move_type ){
                result = true; 
                return false;
            }
            return true;
        });
  
        return result;
    }
  
    set_parameters( stats, moves, xp = 0){
        
        return new Promise( async (resolve, reject) => {
          
          this.attributesStats(stats, xp).then( _ => {
            
            this.attributesMoves(moves); 
            
            resolve(true);
            
          }); 
          
        } );
  
    }
  
    crie(){
  
        const {
            docElements
        } = this; 
  
        try{
            docElements.pokemon.crie.play();
        }catch(e){
            console.log(`an error while crie playing ${e}`);
        }
  
    }
  
  
    async run_encounter(){
  
        const {
            isAWildPokemon,
            animation_classes,
            docElements,
            stats
        } = this;
  
        return new Promise( async ( resolve, reject ) => { 
  
            try{
  
                
                this.wait_for_ms( 300 ).then( async () => {
                  
                    docElements.mainContainer.style.visibility = "";
  
                    if(this.isPokemonFainted) resolve( false);
  
                    docElements.name.innerHTML = `${stats.name}  Niv.${stats.level}`;
  
                    if ( docElements.healthbar.doc.classList.contains( docElements.healthbar.class ) ) docElements.healthbar.doc.classList.remove(docElements.healthbar.class);
                  
                    docElements.healthbar.class = `p100`;
                    docElements.healthbar.doc.classList.add(docElements.healthbar.class);
                    
                    docElements.pokemon.container.classList.add(animation_classes.enter);
                    docElements.pokemon.container.style.visibility = "";
  
                    this.wait_for_ms( 600 ).then( () => { 
                        resolve(true);
     
                        this.crie();
                        docElements.pokemon.container.classList.remove(animation_classes.enter);
                    }); 
                }); 
  
  
            }catch(e){
                console.log(e);
                reject(false);
            }
  
        } );
  
        
    }
  
  
    getRandomInt(max, min=0) {
      
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
      
    }
  
  
    async run_attack( move_index = -1 ){
  
        const {
            isAWildPokemon,
            animation_classes,
            docElements,
            stats,
            moves
        } = this;
  
        return new Promise( async ( resolve, reject ) => { 
  
            try{
  
                if(this.isPokemonFainted) resolve( false );
  
                let targetPkmn = isAWildPokemon ? window.BATTLERS.Player : window.BATTLERS.Wild;
  
                let selected_move = null;
  
                if(move_index == -1){
                    selected_move = moves[ this.getRandomInt(3) ];
                }else{
                    selected_move = moves[ move_index ];
                }
                
              
                docElements.panels.beforeMove.style.display = "none";
                docElements.panels.afterMove.style.display = "";
      
  
                let spe_move = this.isASpecialMove( selected_move );
    
                let att_stat = spe_move ? stats.attack.spe : stats.attack.base;
  
                let target_def = spe_move ? targetPkmn.stats.defense.spe : targetPkmn.stats.defense.base;
    
                let move_resistance = targetPkmn.get_move_resistance( selected_move.type );
                
                let alea = this.getRandomInt(100,85) / 100;
                
                let damagesEval = 0;
                let effTxt = "";
  
                if( selected_move.power > 0) damagesEval = Math.floor( ( 2 * stats.level / 5 + 2 ) * selected_move.power * att_stat / target_def / 50 + 2 ) * move_resistance * alea;
                
                if(damagesEval>0){
  
                  docElements.pokemon.container.classList.add(animation_classes.attack);
  
                  
                    if( move_resistance <= 0.5 ){
  
                        effTxt = "Ce n'est pas très efficace.";
  
                    }else if( move_resistance >= 2 ){
  
                        effTxt = "C'est super efficace !";
  
                    }
  
                }else{
                    
                  docElements.pokemon.container.classList.add(animation_classes.no_attack);
                  
                  effTxt = "Cela n'a pas d'effets sur le pokémon adverse.";
                  
                }
                
                docElements.moves.name.innerHTML = `${stats.name} lance ${selected_move.name}`;
                docElements.moves.resistance.innerHTML = effTxt;
  
                await this.wait_for_ms( 1100 ); 
                    
  
                targetPkmn.run_hit(damagesEval).then( _ => {
          
  
                  if( damagesEval > 0){
  
                    docElements.pokemon.container.classList.remove(animation_classes.attack);
  
                  }else{
  
                    docElements.pokemon.container.classList.remove(animation_classes.no_attack);
  
                  }
                  
                  resolve(true);
                  
                });
  
  
            }catch(e){
                console.log(e);
                reject(false);
            }
  
        } );
  
    }
  
  
    async run_hit( damagesReceived ){
  
        const {
            
            animation_classes,
            docElements,
            stats
        } = this;
  
    
        return new Promise( async ( resolve, reject ) => { 
  
            try{
  
                if(this.isPokemonFainted) resolve( false);
                 
                if( damagesReceived > 0 ){
                  
                  window.audioElements.hit.play();
                  
                  docElements.pokemon.hit.style.display="";   
                  
                  docElements.pokemon.container.classList.add(animation_classes.hit);
                  
                }
                
                
                let update_healthbar = stats.health.active - damagesReceived;
                
                stats.health.active = update_healthbar < 0 ? 0 : update_healthbar;
                stats.health.level = Math.floor( (stats.health.active / stats.health.full) * 100);
                
                docElements.healthbar.doc.classList.remove(docElements.healthbar.class);
                docElements.healthbar.class = `p${stats.health.level}`;
                docElements.healthbar.doc.classList.add(docElements.healthbar.class);
  
                if(!this.isAWildPokemon && stats.health.level <= 20) window.audioElements.lowHealth.play();
  
                await this.wait_for_ms( 1500 );
              
                    if(damagesReceived > 0){
                      
                      docElements.pokemon.container.classList.remove(animation_classes.hit);
                      docElements.pokemon.hit.style.display="none";
                      
                    }
                    
                    this.check_for_end_of_battle();
  
                    resolve(true);
                
  
            }catch(e){
                console.log(e);
                reject(false);
            }
  
        } );
  
    }
  
    check_for_end_of_battle(){
  
        const {
            docElements,
            animation_classes,
            stats
        } = this; 
  
        if(stats.health.level <= 0 ){
  
            this.isPokemonFainted = true;
            docElements.pokemon.container.classList.add(animation_classes.exit);
            
            this.crie();
  
            this.wait_for_ms( 800 ).then( _ => { 
  
                docElements.mainContainer.style.visibility = "hidden";
                window.appEvents.endOfBattle.detail.exit = this.isAWildPokemon ? "victoire" : "défaite";
                window.dispatchEvent( window.appEvents.endOfBattle );
  
            });
  
        }
    }
  
    async wait_for_ms( ms ){ 
  
        return new Promise( ( resolve ) => setTimeout( resolve, ms ) );
  
    }
  
  }
  class playerPKMN extends PKMN{
  
    constructor(  MovesElements = [] ){
  
        super(false);
        this.movesElements = MovesElements;
  
    }
  
    split_on_character( word, target_sym){
      
        let splitWord = word.substring(0, 12);
        
        splitWord = splitWord.split(target_sym);
  
        for (let i = 0; i < splitWord.length; i++) {
          if (splitWord[i].length > 6) splitWord[i] = splitWord[i].substring(0, 6) +".";
        }
  
        return splitWord.join(target_sym);
  
    }
  
    controlMoveNameLength( moveName ) {
  
        if (moveName.includes("-")) {
          
            return this.split_on_character(moveName, "-");
          
        }else if(moveName.includes(" ") ){
          
            return this.split_on_character(moveName, " ");
          
        } else {
            
            let substr =  moveName;
            if( moveName.length > 6 ) substr = moveName.substring(0, 6) +".";
            return substr;
          
        }
      
    }
  
    set_moves_buttons(PlayerStats, PlayerMoves, PlayerXP){
  
        const {
           movesElements,
           moves
        } = this;
  
        this.set_parameters(PlayerStats, PlayerMoves, PlayerXP).then( _ => {
          
          if(movesElements.length <= 0) return; 
  
          movesElements.forEach( button => {
          
          let buttonIndex = parseInt(button.id);
          
          button.innerHTML = this.controlMoveNameLength(moves[buttonIndex].name);
            
            button.addEventListener('click', (event) => {
              
              window.dispatchEvent( window.appEvents.anyClick );
              
              let moveIndex = parseInt(event.target.id);
              this.move_selected(moveIndex);
              
            });
            
        
          });
        });
        
    }
  
  
    move_selected( moveIndex ){
  
        const {
            stats
        } = this;
  
        let playerSpeed = stats.speed; 
        let wildSpeed = window.BATTLERS.Wild.stats.speed;
        
        this.wait_for_ms(500).then( _ => {
          
          if( this.isPokemonFainted ){
            
            window.dispatchEvent( window.appEvents.endOfTurn );
            
          }else{
            
            if( playerSpeed < wildSpeed ){
            
              window.BATTLERS.Wild.run_attack().then( async wildAtt => {
  
                await this.wait_for_ms(500);
  
                if( !this.isPokemonFainted ){
  
                this.run_attack( moveIndex ).then( async playAtt => {
  
                    await this.wait_for_ms(500);
                    window.dispatchEvent( window.appEvents.endOfTurn );
  
                });
                }
  
              });
  
          }else{
              
              this.run_attack( moveIndex ).then( async wildAtt => {
  
                await this.wait_for_ms(250);
  
                if(!window.BATTLERS.Wild.isPokemonFainted ){
  
                    window.BATTLERS.Wild.run_attack().then( async playAtt => {
  
                    await this.wait_for_ms(500);
                      
                    window.dispatchEvent( window.appEvents.endOfTurn );
  
                });
                }
  
              });
  
          }              
          }
            
  
        }); 
      
  
  
    }
  
  }
  
  
  
  export class JEU_POKEMON{
  
  constructor(){
      
    window.BATTLERS = {
      Wild : null, 
      Player : null
    };
    
    
    this.beforeMoveDiv = null;
    this.afterMoveDiv = null;
    this.endBattleDiv = null;
    this.expContainer = null; 
    this.wildXP = null;
    
    this.set_battlers();
    this.set_events();
    
    this.set_medias();
    
    this.get_and_set_docElements();
    
    
  }
  
  set_medias(){
    
    fetch( "medias.json" )
      .then(res => res.json())
      .then( ( jsonObj ) => {
  
        window.mediasURL = jsonObj;
  
      } ).catch( err => console.error( err ) );
    
  }
  
  
  url_backgrounds( day_url, night_url, boss_url ){
    
    window.backgrounds = {
      day : day_url,
      night : night_url,
      boss : boss_url
    };
  
  }
  
  
  url_hit(url){
    window.FX = "https://cdn.glitch.global/7e8b88c9-55ef-4f25-b07d-e8c3bccc676f/bigHit.gif?v=1709155492849";
  }
  
  url_songs( url_wild, url_boss ){
    
    window.SONGS = {
      wild : url_wild,
      boss : url_boss
    };
    
  }
  
  set_battlers(){
  
    window.BATTLERS.Wild = new PKMN(); 
  
    window.BATTLERS.Player = new playerPKMN([
        document.getElementById("0"),
        document.getElementById("1"),
        document.getElementById("2"),
        document.getElementById("3")
    ]);
    
    window.AI2Message = {
        cmd : "", 
        index : 1,
        level : 101,
        xp : 0
    };
    
  }
  
  set_events(){
    
    window.appEvents = {
      
      anyClick : new CustomEvent( 
          "anyClick", 
          { 
              //bubbles: true, 
              detail: 
              {   
  
              }
          } 
      ),
      endOfTurn : new CustomEvent( 
          "endOfTurn", 
          { 
              detail: 
              {   
  
              }
          } 
      ),
      endOfBattle : new CustomEvent( 
          "endOfBattle", 
          { 
              detail: 
              {   
                  exit : "fuite"
              }
          } 
      )
  
    };
  
     //link images url to the stylesheet
    document.addEventListener('DOMContentLoaded', function() {
  
      const framedElements = document.querySelectorAll('.framed');
      framedElements.forEach( (element) => {
        element.style.borderImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAABgQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMM8PuMAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjVkR1hSAAAA5UlEQVRoQ+3MQQrDMBBD0fb+h06N/2A+MTHdTtBbKRpHn0u+UtUf6oepqinTQ1VT62kfyNgbuHcGTaYXmqbT9XXEU6vDUaZvWk/XHxtfn/KOa6YXrk2n/UGGG7K5J8NNpgc3rafBAW7I5p4MGmR6oMFrpvf8xG+ckemV0XraB+czv3RGpldG62n47PzEb5yR6ZXxmmm4IZt7MmiQ6YEGrad9IGNv4N4ZNJleaJpO19cRT60OR5m+aT1df2x8fco7rpleuDad9gcZbsjmngw3mR7ctJ4GB1T1h/phqmrK9FDV1HH6un4ss9jsFZtJkQAAAABJRU5ErkJggg==') 42 round"; });
  
        const progressBarElements = document.querySelectorAll('.progress-bar');
        progressBarElements.forEach( (element) => {
            element.style.borderImageSource = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAYAAABLLYUHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAAfSURBVBhXY/j//z+DhIAAkPrPAGeAaFQOjPH//38GAJDaGTlUem+VAAAAAElFTkSuQmCC')";
        });
  
  
    });
  }
  
  
  get_and_set_docElements(){
    
    const {
      docElements
    } = this;
    
    
    window.audioElements = {
        music : document.getElementById("audio_combat"),
        victory : document.getElementById( "audio_victoire" ),
        escape : document.getElementById( "audio_fuite" ), 
        hit : document.getElementById("audio_coup"),
        level : document.getElementById("audio_niveau"),
        lowHealth :  document.getElementById("audio_critique"),
        button :  document.getElementById("audio_bouton")
    };
    
    window.addEventListener("anyClick", (e)=>{
      window.audioElements.button.play();
    });
    
  
    this.beforeMoveDiv = document.getElementById("beforeMove");
    this.afterMoveDiv = document.getElementById("afterMove");
    this.endBattleDiv = document.getElementById("onEnd");
    
    this.expContainer = document.getElementById("ExpDesc");
    this.wildXP = document.getElementById("expWild");
    this.ai2Button = document.getElementById("AI2Exit");
    
    window.addEventListener("OnAttackSelected", (e)=> {
        this.beforeMoveDiv.style.display = "none";
        this.endBattleDiv.style.display = "none";
        this.afterMoveDiv.style.display = "";
    });
  
    window.addEventListener("endOfTurn", (e)=> {
        this.afterMoveDiv.style.display = "none";
        this.endBattleDiv.style.display = "none";
        
        if( !window.BATTLERS.Player.isPokemonFainted ) this.beforeMoveDiv.style.display = "";
      
    });
       
    window.addEventListener("endOfBattle", (endEvent) => {
        
        window.audioElements.music.pause();
      
        this.ai2Button.style.visibility = "hidden";
  
        this.afterMoveDiv.style.display = "none";
        this.beforeMoveDiv.style.display = "none";
        this.endBattleDiv.style.display = "";
  
        this.expContainer = document.getElementById("ExpDesc");
        this.overContainer = document.getElementById("GameOverDesc");
  
        let eventDetail = endEvent.detail.exit;
  
        window.AI2Message = {
            cmd : eventDetail, 
            index : window.BATTLERS.Player.stats.index,
            level : window.BATTLERS.Player.stats.level,
            xp : window.BATTLERS.Player.stats.experience
        };
  
        if(  eventDetail == "victoire" ){
          
          this.on_victory();
  
        }else if( eventDetail == "défaite" ){
          
          this.on_game_over();
          
        }else if( eventDetail == "fuite" ){
          
          this.on_escape();
          
        }
  
        this.ai2Button.onclick = ( e ) => {
  
            window.dispatchEvent( window.appEvents.anyClick );
             this.messageToAI2( JSON.stringify(window.AI2Message)  );
          
        };
  
  });
  
  
  }
  
   
  on_victory(){
       
   
      window.audioElements.victory.play();
  
      this.expContainer.style.display = "";
      this.wildXP.innerHTML = `${window.BATTLERS.Wild.stats.name} est K.O`;
  
      let gainXP = window.BATTLERS.Wild.get_experience_gain();
  
      let playerXP = document.getElementById("expPlayer");
      playerXP.innerHTML = `${window.BATTLERS.Player.stats.name} remporte ${gainXP} points d'expérience.`;
      
      window.BATTLERS.Player.wait_for_ms(2000).then( _ => {
        
        window.BATTLERS.Player.toNextLevel(gainXP);
      
        if(window.AI2Message.level > window.BATTLERS.Player.stats.level ){
  
          playerXP.innerHTML = `${window.BATTLERS.Player.stats.name} monte au niveau: ${window.AI2Message.level}.`;
  
            window.BATTLERS.Player.wait_for_ms(2000).then( _ => {
                this.ai2Button.style.visibility = "";
            });
  
        }else{
  
            this.ai2Button.style.visibility = "";
  
        }
      });
      
    
  }
  
  on_game_over(){
    
    let overName = document.getElementById("overPlayer");
    overName.innerHTML = `${window.BATTLERS.Player.stats.name} est K.O`;
    this.overContainer.style.display = "";
    
    window.audioElements.lowHealth.pause();
    
    let over =  document.getElementById("expPlayer");
    over.innerHTML = `${window.BATTLERS.Player.stats.name} est K.O !`;
    
    this.ai2Button.style.visibility = "";
    
  }
  
  on_escape(){
  
    window.audioElements.escape.play();
  
    let escapeDiv = document.getElementById("EscapeDesc");
    escapeDiv.style.display = "";
  
    this.ai2Button.style.visibility = "";
    
  }
  
  ClampValue(val, min, max){
    return Math.min(Math.max(val, min), max)
  }
  
  Test( mode = "jour", pkmn_player = 143, pkmn_wild = 40 ){
    
    let testButton = document.getElementById("startButton");
    let buttonTxt = "newbie";
    
    if( mode != "jour" ){
      if( mode == "nuit"){
        buttonTxt = "dark newbie";
      }else{         
        buttonTxt = "great newbie"
      }
    }
    
    testButton.innerHTML = buttonTxt;
    testButton.classList.add("vibrate-1");
    
    let debugPlayerStats = [11, this.ClampValue(pkmn_player, 1,151),"Tajiri","Normal","Normal",68,38,26,23,36,15,189];
    let debugPlayerMoves = [
        [10,"Normal","U R","Le lanceur bloque la route de l’ennemi pour empêcher sa fuite."],
        [25,"Eau","Awesome","Fonction de test 1"],
        [35,"Feu","Superb","Fonction de test 2"],
        [30,"Plante","Amazing","Fonction de test 3"]
    ];
  
    let debugPlayerXP = 189;
  
    let debugWildStats = [11,mode == "boss" ? 0 : this.ClampValue(pkmn_wild, 1,151),"Sugimori","Poison","Vol",33,17,13,14,15,19,49];
    let debugWildMoves = [
        [10,"Normal","secondeBeam","Fonction de test 1"],
        [15,"Vol","oiselStorm","Fonction de test 2"],
        [20,"Normal","legtaSlash","Fonction de test 3"],
        [25,"Psy","sntDoom","Fonction de test 4"]
    ];
  
    this.start(mode, debugPlayerStats, debugPlayerMoves, debugPlayerXP, debugWildStats,  debugWildMoves );
  
  }
  
  
  AI2start(){
    
    let appInventorInput = window.AppInventor.getWebViewString();
    
    let appInventorJSON = JSON.parse( appInventorInput );
    
    let AI2Mode = appInventorJSON.mode;
    
    let AI2PlayerStats = JSON.parse(appInventorJSON.player.stats);
    let AI2PlayerMoves = JSON.parse(appInventorJSON.player.moves);
    let AI2PlayerXP = parseInt(appInventorJSON.player.xp);
  
    let AI2WildStats = JSON.parse(appInventorJSON.wild.stats);
    let AI2WildMoves = JSON.parse(appInventorJSON.wild.moves);
    
    this.start(AI2Mode, AI2PlayerStats, AI2PlayerMoves, AI2PlayerXP, AI2WildStats, AI2WildMoves );
    
  }
  
  start( mode, PlayerStats, PlayerMoves, PlayerXP, WildStats, WildMoves ){
    
    const mainViewElement = document.querySelector('.combatPanel');
  
    if( mode == "boss" ){
   
      window.bossMode = true;
      mainViewElement.style.backgroundImage = `url(${window.backgrounds.boss})`; 
      
      window.audioElements.music.src = window.SONGS.boss;
  
      /*let wildContainer = document.getElementById("wildImgContainer");
      wildContainer.style.transform = "scale(1.5)";*/
      
    }else{
      
      window.bossMode = false;
      mainViewElement.style.backgroundImage = mode == "jour" ? `url(${window.backgrounds.day})` : `url(${window.backgrounds.night})`; 
      window.audioElements.music.src = window.SONGS.wild;
    
    }
         
    window.BATTLERS.Player.set_moves_buttons( PlayerStats, PlayerMoves, PlayerXP );
      
    window.BATTLERS.Wild.set_parameters( WildStats, WildMoves ).then( _ => {
  
      
      let button = document.getElementById("startButton");
      button.addEventListener("click", ( e ) => {
      
        this.run_game();
      
      } ); 
  
      
      button.style.visibility = "";  
  
    });
      
    
    
  }
  
  run_game(){
    
    
    let startView = document.getElementById("vueDemarrage");
    startView.style.display="none";
  
    window.audioElements.music.loop = true;
    window.audioElements.music.play();
  
    const mainPanel = document.getElementById("vuePrincipale");
    mainPanel.style.visibility = "";
    
    let divStart = document.getElementById("onStart");
    let wildPkmnEncounter = document.getElementById("PkmnEncounter");
    wildPkmnEncounter.innerHTML = `Vous rencontrez un <b>${window.BATTLERS.Wild.stats.name}</b> !`;
  
    let buttonAttack = document.getElementById("AttButton");
    let buttonEscape = document.getElementById("EscButton");
  
    
    window.BATTLERS.Wild.run_encounter().then( (wildAsync) => {
      
      divStart.style.display = "";
      
      window.BATTLERS.Player.run_encounter().then( (playerAsync) => {
        
        
          buttonAttack.onclick = (e) => {
            
              window.dispatchEvent( window.appEvents.anyClick );
            
              divStart.style.display ="none";
              this.beforeMoveDiv.style.display = "";
              
          };
  
          buttonEscape.onclick = (e) => {
              
              window.dispatchEvent( window.appEvents.anyClick );
            
              divStart.style.display ="none";
              window.dispatchEvent( window.appEvents.endOfBattle );
  
          };
        
      });
    });
  
  }
  
  messageToAI2(message){
    try{
        window.AppInventor.setWebViewString(message);
        //window.alert(message);
    }catch(e){
        console.log(e);
    }
  }
  
  }
