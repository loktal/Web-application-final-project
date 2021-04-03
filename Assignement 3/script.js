// les fonctions les bouttons et les fonctionnalitées sont ordonné en fonction de l'HTML

// partie varibles et url utiles 
const API_KEY = '1360f607b171b12a4eaae473fa717e10';

//url for searching a move
const url = 'https://api.themoviedb.org/3/search/movie?api_key=1360f607b171b12a4eaae473fa717e10';
//https://api.themoviedb.org/3/search/movie?api_key=1360f607b171b12a4eaae473fa717e10&query=U.N.C.L.E


//url for finding a movie select by the movie id 
let movieID = 60398;
const selectmovieURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}`;
const crewmovieURL = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${API_KEY}`;

// constantes 

let nodes1 = document.querySelectorAll('#verificateName');
let verificateButtonName = nodes1[nodes1.length- 1];


let nodes2 = document.querySelectorAll('#answerPerson') ;
let inputElement = nodes2[nodes2.length- 1];

let movieDiv = document.querySelector('.container-movie-info');



let movieListe =["Somebody Help Me"]

let PersonInfo ;

// partie fonctionnalités
async function findMovie(){
    await fetch(selectmovieURL)
        .then((response) => response.json())
        .then(async data => {
            const movie = data;
            const movieBlock = await display(movie);
            movieDiv.appendChild(movieBlock);
        })
        .catch(error => {
            console.log(error);
    });
};

let display = (movie) =>{
    const MovieElement = document.createElement('div');
    MovieElement.setAttribute('class','movie');

    const movieTemplate = `
        <br>
        <section class="image-part">
            <img src=https://image.tmdb.org/t/p/w200/${movie.poster_path} data-movie-id=${movie.id}/>
        </section>
        <div class="title-release-date">
            <p id="title">Title: ${movie.title}</p>
            <p id="title">Release date: ${movie.release_date}</p>
        </div>
        
    `;
    MovieElement.innerHTML = movieTemplate;
    return MovieElement;

};

let verificator = (crew,value) => {  // le director est dans cast avec job: "Director"  ici c'est "Chris Stokes"
    
    let right = false;
    let person = undefined;
    crew.cast.map((actor) => {
        if (actor.name.toUpperCase() == value.toUpperCase()) {
            console.log(true);
            right = true;
            person = actor;
            return [right,person];
        };
    });

    crew.crew.map((director) => {
        if (director.job == "Director") {
            if (director.name.toUpperCase() == value.toUpperCase()){
                console.log(true);
                right = true;
                person = director;
                return [right,person];
            };
        };
    });

    return [right,person];
};

let falseTemplateMaker = (value) =>{

    const falseElement = document.createElement('falseDiv');
    

    const falseTemplate = `
        <p style="color:red;"> Biiiiiippppp ! ${value} is a wrong answer, try something else !</p>
    `;

    falseElement.innerHTML = falseTemplate;
    return falseElement;
};



let trueTemplateMaker = (PersonInfo) =>{

    const trueElement = document.createElement('trueDiv');
    

    const trueTemplate = `
        <h1 style="color:green;"> Bravisimo ! </h1>
        <br>
        <section class="image-person-part">
            <img src=https://image.tmdb.org/t/p/w200/${PersonInfo.profile_path} alt="The photo of ${PersonInfo.name}. Please visualize a photo of ${PersonInfo.name} in your mind."/>
        </section>
        <br>
        <h2> ${PersonInfo.name} </h2>
        <br>
        <p>${PersonInfo.biography}</p>
        <form>
            <div class="formgroup">
            
                <label for="answer">Give the name of a movie where ${PersonInfo.name} was actor or director.<br></label>
                <input type="text" id="answerMovie" class="input">
                
            </div>
            <br>
            <button type="submit" class="Verificate" id="verificateMovie">Validate</button>
        </form>
    `;

    trueElement.innerHTML = trueTemplate;
    return trueElement;
};





let verificatorAlsoKnowFor = (LastJobs,value) => {  // ici pour le directeur on peut utiliser "Fall Girls" ou "Boy Bye"
    
    let right = false;
    let movie = undefined;
    let flag = false;

    movieListe.map((movie) => {
        if (movie.toUpperCase() == value.toUpperCase()) {
            displayNotValidMovie();
            flag=true;
            return [right,movie];
        };
    });

    if (flag === false){
    LastJobs.cast.map((actorMovie) => {
        if (actorMovie.title.toUpperCase() == value.toUpperCase()) {
            console.log(true);
            right = true;
            movie = actorMovie;
            return [right,movie];
        };
    });

    LastJobs.crew.map((directorMovie) => {
        if (directorMovie.job == "Director") {
            if (directorMovie.title.toUpperCase() == value.toUpperCase()){
                console.log(true);
                right = true;
                movie = directorMovie;
                return [right,movie];
            };
        };
    });
};
    return [right,movie];
};

let displayNotValidMovie = () =>{
    const responseDiv = document.querySelector('.response')

    const falseElement = document.createElement('formDiv');
    
    const falseTemplate = `
    <p style="color:red;"> You already say that movie!</p>
    `;

    falseElement.innerHTML = falseTemplate;
    responseDiv.appendChild(falseElement);
};


let displayfrom = () =>{
    
    const formElement = document.createElement('formDiv');
    

    const formTemplate = `
        <form>
        <div class="formgroup">
            <label for="answer">Give me the name of the director or one of the actors <br></label>
            <input type="text" id="answerPerson" class="input">
        </div>
        <br>
        <button type="submit" class="Verificate" id="verificateName">Validate</button>

        <div class="response">

        </div>
        </form>
    `;

    formElement.innerHTML = formTemplate;
    return formElement;
};


// partie boutton 

verificateButtonName.onclick = async function(event) {

    event.preventDefault(); //avoid the page to realod
    const value = inputElement.value;
    const responseDiv = document.querySelector('.response')

    await fetch(crewmovieURL)
        .then((response) => response.json())
        .then( async data  => {
            console.log(data)
            const crew = data;
            const rightPerson = await verificator(crew,value);
            
            if(rightPerson[0] == false){
                //responseDiv.innerHTML = ""  // clear the div so i don't have an infinite list of red messages
                const falseTemplate = await falseTemplateMaker(value);
                responseDiv.appendChild(falseTemplate);
            }else{        //if it is not false it is true
                //responseDiv.innerHTML = ""
                const PersonURL = `https://api.themoviedb.org/3/person/${rightPerson[1].id}?api_key=${API_KEY}`;
                PersonInfo = await fetch(PersonURL)
                                    .then((response) => response.json())
                                    .catch(error => {
                                        console.log(error);
                                });
                const trueTemplate = await trueTemplateMaker(PersonInfo);
                responseDiv.appendChild(trueTemplate);
                
                // une fois que tout est créer on peut le select et l'utiliser
                const nodes4 = document.querySelectorAll('#verificateMovie')
                const verificateButtonMovie = nodes4[nodes4.length- 1];
                verificateButtonMovie.addEventListener("click",verificateButtonMovieFunction);

            }

        })
        .catch(error => {
            console.log(error);
    });

    

}


let verificateButtonMovieFunction = async (event) => {
    event.preventDefault();
    const nodes5 = document.querySelectorAll('#answerMovie');
    const inputElementMovie = nodes5[nodes5.length- 1];
    const value = inputElementMovie.value;
    const responseDiv = document.querySelector('.response')
    console.log(PersonInfo);

    const alsoKnowForURL = `https://api.themoviedb.org/3/person/${PersonInfo.id}/movie_credits?api_key=${API_KEY}`;

    await fetch(alsoKnowForURL)
        .then((response) => response.json())
        .then( async data  => {
            console.log(data);
            const LastJobs = data;
            const rightMovie = await verificatorAlsoKnowFor(LastJobs,value);
            //console.log(rightMovie[1]);
            if(rightMovie[0] == false){
                
                const falseTemplate = await falseTemplateMaker(value);
                responseDiv.appendChild(falseTemplate);
            }else{        //if it is not false it is true
                movieID = rightMovie[1].id;
                movieListe.push(`${rightMovie[1].title}`); 

                const movieURL =`https://api.themoviedb.org/3/movie/${rightMovie[1].id}?api_key=${API_KEY}`;

                MovieInfo = await fetch(movieURL)
                                    .then((response) => response.json())
                                    .catch(error => {
                                        console.log(error);
                                });
                
                
                const movieBlock = await display(MovieInfo);
                responseDiv.appendChild(movieBlock);
                
                const suite = await displayfrom();
                responseDiv.appendChild(suite);


                const nodes6 = document.querySelectorAll('#verificateName')
                const verificateButtonName2 = nodes6[nodes6.length- 1];
                verificateButtonName2.addEventListener("click",verificateButtonName2Function);




            }
        })
        .catch(error => {
            console.log(error);
    });


};


let verificateButtonName2Function = async (event) => {

    event.preventDefault(); //avoid the page to realod
    let nodes7 = document.querySelectorAll('#answerPerson') ;
    let inputElementPerson = nodes7[nodes7.length- 1];
    const value = inputElementPerson.value;
    const responseDiv = document.querySelector('.response')

    console.log(value);
    console.log(movieID);
    const crewmovieURL2 = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${API_KEY}`;

    await fetch(crewmovieURL2)
        .then((response) => response.json())
        .then( async data  => {
            console.log(data)
            const crew = data;
            const rightPerson = await verificator(crew,value);
            
            if(rightPerson[0] == false){
                //responseDiv.innerHTML = ""  // clear the div so i don't have an infinite list of red messages
                const falseTemplate = await falseTemplateMaker(value);
                responseDiv.appendChild(falseTemplate);
            }else{        //if it is not false it is true
                //responseDiv.innerHTML = ""
                const PersonURL = `https://api.themoviedb.org/3/person/${rightPerson[1].id}?api_key=${API_KEY}`;
                PersonInfo = await fetch(PersonURL)
                                    .then((response) => response.json())
                                    .catch(error => {
                                        console.log(error);
                                });
                const trueTemplate = await trueTemplateMaker(PersonInfo);
                responseDiv.appendChild(trueTemplate);
                
                // une fois que tout est créer on peut le select et l'utiliser
                const nodes4 = document.querySelectorAll('#verificateMovie')
                const verificateButtonMovie = nodes4[nodes4.length- 1];
                verificateButtonMovie.addEventListener("click",verificateButtonMovieFunction);

            }

        })
        .catch(error => {
            console.log(error);
    });

};


// partie execution de code 

findMovie()






// the website run on https://web-architecture-assignement-3.herokuapp.com/

