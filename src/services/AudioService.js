import {Howl, Howler} from 'howler';

export default class AudioService {
    
    constructor() {
        console.log("new AudioService()")
        Howler.autoUnlock = true;
        //Howler.autoSuspend = false;
        this.sounds = new Howl({
            src: ['audio\\fx.mp3'],
            preload: true,
            //html5: true,
            //pool: 8,
            sprite: {
                start: [0, 1000],
                stop: [2000, 1000],
                count: [4000, 1000],
                count4: [6000, 1000],
                count3: [8000, 1000],
                count2: [10000, 1000],
                count1: [12000, 1000],
                halftime: [14000, 6000]
            },
            onload: () => {
                console.log("Audio loaded!")
            },
            onplay: (id) => {
                console.log("Audio played " + id);
            },
            onloaderror: (id, error) => {
                console.log("Audio failed to load.")
                console.error(error);
            },
            onplayerror: (id, error)	=> {
                console.log("Audio failed to play.")
                console.error(error);
            }		
        });	

        this.setVolume(50);
        //console.dir(window.speechSynthesis.getVoices());
    }

    async start() {
        this.playEffect("start");
    }

    async stop() {
        this.playEffect("stop");
    }

    async count(count) {
        if (count > 4) {
            this.playEffect("count");
        }
        else {
            this.playEffect("count"+count);
        }
        
    }

    async halftime() {
        this.playEffect("halftime");
    }
	
	async playEffect( effect ) {
        console.log("playeEffect " + effect)
        this.previouslyPlayedEffect = effect;
		this.sounds.play( effect );
	}
	
	async setVolume( volume ) {
		this.volume = volume;
		this.sounds.volume( this.volume / 100.0 );
    }
    
    async say(text) {
        /*
        if (window.speechSynthesis) {
            const utterThis = new SpeechSynthesisUtterance(text);
            utterThis.lang = "fi-FI";
            window.speechSynthesis.speak(utterThis);
        }
        */
    }
}