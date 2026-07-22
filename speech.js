// Init SpeechSynth API
const synth = window.speechSynthesis;
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value'); // FIXED: Added '#' missing selector
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// Init voice array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    
    // Clear current options to prevent duplication issues
    voiceSelect.innerHTML = '';

    // Loop through voices and create an option for each one
    voices.forEach(voice => {
        const option = document.createElement('option');
        // Filling options with voices and languages
        option.textContent = `${voice.name} (${voice.lang})`;
        // Set needed attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
    // Check if already speaking
    if (synth.speaking) {
        console.log('Already speaking...');
        return;
    }

    if (textInput.value !== '') {
        // Add background animation
        body.style.background = '#141414 url(./img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';

        // Get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        // Speak end
        speakText.onend = e => {
            console.log('Done speaking...');
            body.style.background = '#141414';
        };

        // Speak error
        speakText.onerror = e => {
            console.error('Something went wrong');
            body.style.background = '#141414';
        };

        // Selected voice
        if (voiceSelect.selectedOptions.length > 0) {
            const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
            voices.forEach(voice => {
                if (voice.name === selectedVoice) {
                    speakText.voice = voice;
                }
            });
        }

        // Set rate and pitch
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Speak
        synth.speak(speakText);
    }
};

// Event Listeners

// Text form submit
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

// Rate value change (Changed to 'input' for live real-time number updates)
rate.addEventListener('input', e => {
    rateValue.textContent = rate.value;
});

// Pitch value change (Changed to 'input' for live real-time number updates)
pitch.addEventListener('input', e => {
    pitchValue.textContent = pitch.value;
});

// Voice select change
voiceSelect.addEventListener('change', e => speak());
