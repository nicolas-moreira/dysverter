const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const say = require('say');
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const LanguageToolApi = require('language-grammar-api');


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'pug');
app.set('views','views');



const options = {
  endpoint: 'https://languagetool.org/api/v2'
};

const languageToolClient = new LanguageToolApi(options);

async function getLanguages(){
     languageToolClient.languages().then((res) => {
         console.log(res,"test");
     });
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



let spellCheck = new Object();

spellCheck.analyse = async function (text) {
        var response = await languageToolClient.check({
            text: `${text}`, // required
            language: 'fr' // required (you can use .languages call to get language)
        });
        response.text = `${text}`;
        return response;
}

app.post("/dev", (req,res,next) => {
    
    spellCheck.analyse(req.body.clientText).then((resp) => {
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