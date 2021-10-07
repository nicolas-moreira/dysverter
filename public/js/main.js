const textModule = document.querySelector('.test');
const espacement = document.querySelector('.espacement');
const taillePolice = document.querySelector('.taillePolice');
const espacementLettres = document.querySelector('.espacementLettres')
const espacementMots = document.querySelector('.espacementMots')
const lire = document.querySelector('.lire');
const vitesse = document.querySelector('.vitesse');
const player = document.querySelector('.player');
const textbox = document.querySelector('.textbox');

// Module de text
textModule.addEventListener('change', (event) => {


})

espacement.addEventListener('mouseup', (event) => {
    const value = event.target.value;
    console.log(value);
    document.documentElement.style.setProperty('--marginBottom', `${value}px`);
})

taillePolice.addEventListener('mouseup', (event) => {
    const value = event.target.value;
    document.documentElement.style.setProperty('--fontSize', `${value}px`);
})

espacementLettres.addEventListener('mouseup', (event) => {
    const value = event.target.value;
    document.documentElement.style.setProperty('--espacementLettres', `${value}px`);
})

espacementMots.addEventListener('mouseup', (event) => {
    const value = event.target.value;
    document.documentElement.style.setProperty('--espacementMots', `${value}px`);
})


// Synthese Vocal

lire.addEventListener('click', (event) => {
        console.log(vitesse.value);
        let data = {text: `${textModule.value}`, vitesse:`${vitesse.value}`};

        async function fetchData() {
            
            let response = await fetch('/syntheseVocal', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(data),
            });

            let responseJson = await response.json();
            let fromServer = responseJson.audio;
            return fromServer;
        }

        fetchData().then( (res) => {
            player.classList.remove("Hidden");
            player.src = res;
        });

})


// fetch corrector
async function fetchWords(text) {
    let data = {texto: `${text}`};
    let response = await fetch('/dev', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(data),
    });

    let responseJson = await response.json();
    return responseJson;
}


textModule.addEventListener('keyup', (event) => {

    //Auto corrector
    // fetchWords(event.target.value)
    // .then( (res) => {
    //     const errors = res.matches;
    //             for(var i = 0; i < errors.length; i++){
    //                 console.log({
    //                     "word": res.text.substring(errors[i].offset, errors[i].offset+errors[i].length),
    //                     "offset": errors[i].offset,
    //                     "length": errors[i].length,
    //                     "suggestions": errors[i].replacements
    //                 });
                    
    //             }
    // });

//////////////////////////////////////////////////////////////////////////////////////////
    // Underline color
    var splitText = event.target.value.replace(/\n/g, "<br />");
    splitText = splitText.split("<br />");
    var newHtml = "";
    
    for(var i = 0; i < splitText.length; i++){
        if(splitText[i] != ""){
            if(i % 2 == 0){
                newHtml += "<p class='each-line red'>"+splitText[i]+'</p>'
            }else{
                newHtml += "<p class='each-line green'>"+splitText[i]+'</p>';
            }
        }
    }
    
    textbox.innerHTML = newHtml;

    //////////////////////////////////////////////////////////////////////////////////////////
    // Hide or show lecture btn
        if(textModule.value.length > 0){
            lire.disabled = false;
        }else{
            lire.disabled = true;
            player.classList.add("Hidden");
        }

})

// add line break after each paste in the textarea
textModule.addEventListener("paste", (event) => {
    
    if (event.target.value !== "")
    {
        event.target.value = event.target.value + "\n";
    }

}, false);


