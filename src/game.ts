class DiceElement extends HTMLElement {

    private _value:number;
    public set value(val:any) {
        this._value = parseInt(val);
        this.valueContainer.innerText = this._value.toString();
    }
    public get value() {
        return this._value;
    }

    private _locked:boolean;
    public set locked(val:any) {
        this._locked = !!val;
        if(this._locked) {
            this.classList.add('locked');
            return;
        }
        this.classList.remove('locked');
    }
    public get locked() {
        return this._locked;
    }    

    static get observedAttributes() { return ['value', 'locked']; }
    attributeChangedCallback(attrName:string, oldVal:string, newVal:string) {
        if(attrName === 'value') {
            this.value = newVal;
        }
        if(attrName === 'locked') {
            if(newVal === null) {
                this.locked = false;
                return;
            }
            if(!newVal && typeof newVal === 'string') {
                this.locked = true;
                return;
            }
            this.locked = newVal;
        }
    }

    valueContainer:HTMLDivElement;
    connectedCallback() {
        this.valueContainer = <HTMLDivElement>document.createElement('div');
        this.appendChild(this.valueContainer);
        /* Set default value */
        this.value = 6;
    }

    roll() {
        let randomTime = 400+Math.floor(Math.random()*600);
        const animation = `shake ${randomTime}ms`;
        this.style.animation = this.style.webkitAnimation = animation;

        setTimeout(_=>{
            this.value = Math.floor(Math.random() * 6) + 1;  
            this.style.animation = this.style.webkitAnimation = '';
        }, randomTime);

        return this.value;
    }
}
customElements.define('p-dice', DiceElement);


class Game {
    private diceList: DiceElement[];

    createDice(container:HTMLElement) {
        let diceEle = <DiceElement>document.createElement('p-dice');
        container.appendChild(diceEle);

        diceEle.addEventListener('click', e => {
            diceEle.locked = !diceEle.locked;
        });

        this.diceList.push(diceEle);
    }

    rollAllDice() {
        this.diceList
            .filter(dice => !dice.locked)
            .forEach(dice => {
                dice.roll();
            });
    }

    unlockAllDice() {
        this.diceList.forEach(dice => {
            dice.locked = false;
        })
        this.rollAllDice();
    }

    startGame(numberOfDice:Number) {
        this.diceContainer.innerHTML = '';
        this.diceList = [];
        for (let i = 0; i < numberOfDice; i++){
            this.createDice(this.diceContainer);
        }
    }

    private settingsContainer:HTMLElement;
    private gameContainer:HTMLElement;
    private diceContainer:HTMLElement;

    constructor(private element:HTMLElement) {

        this.rollAllDice = this.rollAllDice.bind(this);
        this.unlockAllDice = this.unlockAllDice.bind(this);

        this.settingsContainer = document.createElement('div');
        this.element.appendChild(this.settingsContainer);

        const numberSelector = document.createElement('select');
        let optionStr='';
        for (let i = 1; i < 10; i++){
            optionStr+=`<option value="${i}">${i} dice</option>`;
        }
        numberSelector.innerHTML = optionStr;
        this.settingsContainer.appendChild(numberSelector);

        const startBtn = document.createElement('button');
        startBtn.innerText = 'Start';
        this.settingsContainer.appendChild(startBtn);
        startBtn.addEventListener('click', e => {
            this.settingsContainer.hidden = true;
            this.gameContainer.hidden = false;
            this.startGame(parseInt(numberSelector.value));
        });

        this.gameContainer = document.createElement('div');
        this.element.appendChild(this.gameContainer);
        this.diceContainer = document.createElement('div');
        this.diceContainer.className = 'dice-container';
        this.gameContainer.appendChild(this.diceContainer);
        this.gameContainer.hidden = true;

        let rollBtn = document.createElement('button');
        rollBtn.classList.add('primary-btn');
        rollBtn.innerText = 'Roll';
        this.gameContainer.appendChild(rollBtn);
        rollBtn.addEventListener('click', this.rollAllDice);

        let unlockBtn = document.createElement('button');
        unlockBtn.classList.add('primary-btn');
        unlockBtn.innerText = 'Deselect all & roll';
        this.gameContainer.appendChild(unlockBtn);
        unlockBtn.addEventListener('click', this.unlockAllDice);

        let quitBtn = document.createElement('button');
        quitBtn.innerText = 'Quit game';
        this.gameContainer.appendChild(quitBtn);
        quitBtn.addEventListener('click', e => {
            this.settingsContainer.hidden = false;
            this.gameContainer.hidden = true;
        });
    }
}


// class Dice {
//     private _locked = false;;
//     public set locked(val) {
//         this._locked = val;
//         if(this._locked) {
//             this.element.classList.add('locked');
//             return;
//         }
//         this.element.classList.remove('locked');
//     }
//     public get locked() {
//         return this._locked;
//     }
    
//     private _value = null;
//     public set value(val) {
//         this._value = val;

//         if(this.element) {
//             this.element.innerText = this._value;
//         }
//     }
//     public get value() {
//         return this._value;
//     }

//     roll(){
//         let randomTime = 400+Math.floor(Math.random()*600);

//         this.element.style.animation = '';
//         this.element.style.webkitAnimation = '';
//         requestAnimationFrame(_=>{
//             requestAnimationFrame(_=>{
//                 this.element.style.animation = `shake ${randomTime}ms`;   
//                 this.element.style.webkitAnimation = `shake ${randomTime}ms`;                            
//             });
//         });
//         setTimeout(_=>{
//             this.value = Math.floor(Math.random() * 6) + 1;            
//         }, randomTime);

//         return this.value;
//     }

//     constructor(private element?: HTMLElement, autoroll = true) {
//         this.value = '6';
//         if(autoroll) {
//             this.roll();
//         }
//         this.element.addEventListener('click', e => {
//             this.locked = !this.locked;
//         });
//     }
// }