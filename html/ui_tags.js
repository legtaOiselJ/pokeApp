class legtaPokemon extends HTMLElement {
    
    constructor() {
      
        super();

        const type = this.getAttribute("type");//wild or player

        const mainContainer = document.createElement('div');
        mainContainer.setAttribute('id', `${type}MainContainer`);
        mainContainer.setAttribute('class', type );
        mainContainer.style.visibility = 'hidden';

        const objectStats = document.createElement('div');
        objectStats.setAttribute('id', `${type}Stats`);
        objectStats.setAttribute('class', 'roundContainer');

        const statusDiv = document.createElement('div');
        statusDiv.setAttribute('class', 'status');

        const objectName = document.createElement('h4');
        objectName.setAttribute('id', `${type}Name`);

        const statsDiv = document.createElement('div');
        statsDiv.setAttribute('class', 'stats');

        const progressHPContainer = document.createElement('div');
        progressHPContainer.setAttribute('id', `${type}ProgressHP`);
        progressHPContainer.setAttribute('class', 'progress-bar-container');

        const labelHP = document.createElement('label');
        labelHP.setAttribute('for', `${type}HP`);
        labelHP.textContent = 'PV:';

        const progressHP = document.createElement('div');
        progressHP.setAttribute('id', `${type}HP`);
        progressHP.setAttribute('class', 'progress-bar p100');

        const objectPkmn = document.createElement('div');
        objectPkmn.setAttribute('id', `${type}Pkmn`);
        objectPkmn.style.visibility = 'hidden';

        const audioCrie = document.createElement('audio');
        audioCrie.setAttribute('id', `${type}Crie`);

        const sourceAudio = document.createElement('source');
        sourceAudio.setAttribute('src', '');
        sourceAudio.setAttribute('type', 'audio/ogg');

        const objectImgContainer = document.createElement('div');
        objectImgContainer.setAttribute('id', `${type}ImgContainer`);
        objectImgContainer.setAttribute('class', 'pokemon');
        
        const objectSprite = document.createElement('img');
        objectSprite.setAttribute('id', `${type}Sprite`);
        objectSprite.setAttribute('class', 'pokemonSprite');
        objectSprite.setAttribute('alt', `${type}_image`);

        const objectFX = document.createElement('img');
        objectFX.setAttribute('id', `${type}FX`);
        objectFX.setAttribute('class', 'fade-out');
        objectFX.style.display = 'none';
        objectFX.setAttribute('alt', `${type}_fx`);
      
        progressHPContainer.appendChild(labelHP);
        progressHPContainer.appendChild(progressHP);
        statsDiv.appendChild(progressHPContainer);
        statusDiv.appendChild(objectName);
        statusDiv.appendChild(statsDiv);
        objectStats.appendChild(statusDiv);

        objectImgContainer.appendChild(objectSprite);
        objectImgContainer.appendChild(objectFX);
        objectPkmn.appendChild(audioCrie);
        objectPkmn.appendChild(objectImgContainer);

        mainContainer.appendChild(objectStats);
        mainContainer.appendChild(objectPkmn);
        
        this.appendChild(mainContainer);
    }
}

class legtaUI extends HTMLElement {
    constructor() {
        
        super();
        
        const mainContainer = document.createElement('div');
        mainContainer.setAttribute('class', 'framed neutral');
        mainContainer.style.height = '225px';

        const onStartDiv = document.createElement('div');
        onStartDiv.setAttribute('id', 'onStart');
        onStartDiv.setAttribute('class', 'MoveSel');
        onStartDiv.style.display = 'none';
        onStartDiv.innerHTML = `
            <h4 id="PkmnEncounter"></h4>
            <br>
            <h4>Que souhaitez-vous faire ?</h4>
            <br>
            <br>
            <button id="AttButton">Attaquer le pokemon</button>
            <button id="EscButton" style='margin-left:10px'>Fuir</button>
        `;
          
        /*const onStartButtonsDiv = document.createElement('div');
        onStartButtonsDiv.setAttribute('class', 'HorizontalArrangement');
        
        onStartButtonsDiv.innerHTML =  `

            <button id="AttButton">Attaquer le pokemon</button>
            <button id="EscButton">Fuir</button>
        `;*/
        const afterMoveDiv = document.createElement('div');
        afterMoveDiv.setAttribute('id', 'afterMove');
        afterMoveDiv.setAttribute('class', 'DivDesc');
        afterMoveDiv.style.display = 'none';
        afterMoveDiv.innerHTML = `
            <div id="AttDesc">
                <h3 id="MoveName"></h3>
                <br>
                <h5 id="MoveEfficacity"></h5>
            </div>
        `;

        const onEndDiv = document.createElement('div');
        onEndDiv.setAttribute('id', 'onEnd');
        onEndDiv.setAttribute('class', 'DivDesc');
        onEndDiv.style.display = 'none';
        onEndDiv.innerHTML = `
            <div id="ExpDesc" style="display:none;">
                <h3 id="expWild"></h3>
                <h2 id="expPlayer"></h2>
            </div>
            <div id="GameOverDesc" style="display:none;">
                <h3 id="overPlayer"></h3>
                <h2>Vous avez perdu le combat!</h2>
            </div>
            <div id="EscapeDesc" style="display:none;">
                <br>
                <h2>Vous prenez la fuite !</h2>
            </div>
            <button id="AI2Exit" style="visibility:hidden;">OK</button>
        `;

        const beforeMoveDiv = document.createElement('div');
        beforeMoveDiv.setAttribute('id', 'beforeMove');
        beforeMoveDiv.setAttribute('class', 'AttPanel');
        beforeMoveDiv.style.display = 'none';
        beforeMoveDiv.innerHTML = `
            <div class="AttSel">
                <h4 id="pkmnCmd"></h4>
            </div>
            <div class="AttList">
                <ul id="MovesButtonsList" class="buttons compact">
                    <li><button id="0"></button></li>
                    <li><button id="1"></button></li>
                    <li><button id="2"></button></li>
                    <li><button id="3"></button></li>
                </ul>
            </div>
        `;


        mainContainer.appendChild(onStartDiv);
        mainContainer.appendChild(afterMoveDiv);
        mainContainer.appendChild(onEndDiv);
        mainContainer.appendChild(beforeMoveDiv);

        this.appendChild(mainContainer);
      
    }
}


customElements.define('legta-ui', legtaUI);
customElements.define('legta-pokemon', legtaPokemon);
