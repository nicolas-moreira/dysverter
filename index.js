const express = require('express');
const path = require('path');
const say = require('say');
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const { v4: uuidv4 } = require('uuid');

const LanguageToolApi = require('language-grammar-api');


app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views','views');

app.use(express.static(path.join(__dirname, "public")));


const options = {
  endpoint: 'https://languagetool.org/api/v2'
};
 
const languageToolClient = new LanguageToolApi(options);

async function getLanguages(){
     languageToolClient.languages().then((res) => {
         console.log(res,"test");
     });
}

let spellCheck = new Object();
const varlog = (varToPrint) => console.log(varToPrint);

spellCheck.analyse = async function getErrors(text) {
        var test = await languageToolClient.check({
            text: `${text}`, // required
            language: 'fr' // required (you can use .languages call to get language)
        });
        test.text = `${text}`;
        return test;
}

app.get("/", (req,res,next) => {
    res.status(200).render("dysverter");
});

app.get("/apropos", (req,res,next) => {
    res.status(200).render("accueil");
})

app.get("/contacts", (req,res,next) => {
    res.status(200).render("contact");
})


app.post("/dev", (req,res,next) => {
    var textToCheck = req.body.texto;

    spellCheck.analyse(textToCheck).then((resp) => {
        const errors = resp.matches;
        res.json(resp);
    });
});



app.post("/syntheseVocal", (req,res,next) => {
    var uid = uuidv4();
    
    say.export(`${req.body.text}`, 'Audrey', `${req.body.vitesse}` , `public/audios/${uid}.wav`, (err) => {
            var data = {audio: `audios/${uid}.wav`};
            res.json(data);
      })
});


const server = app.listen(port, () => console.log("Listening on port 3000"));
