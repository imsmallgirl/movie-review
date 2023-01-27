import { action,autorun,makeObservable, observable} from "mobx";
import { v4 as uuidv4 } from 'uuid';

export class Movie {
    id = uuidv4();
    title = "";
    content = "";
    rate = 0;

    constructor(title, content, rate){
        this.title = title;
        this.content = content;
        this.rate = rate;

        makeObservable(this, {
            title : observable,
            content : observable,
            rate : observable,
        })

    }
}

export class MovieStore {
    id = "movieReview"
    localStorage = null;
    movies = [];

    constructor(){
        makeObservable(this, {
            movies : observable,
            createMovie : action,
            getMoviesIndex : action,
            deleteMovie : action,
            editMovie : action,
            editRate : action,
            loadLocalStorage : action,
        })

        this.initLocalStorage();

        autorun(() => {
            if(this.localStorage !== null){
                this.localStorage.setItem(this.id, JSON.stringify(this.movies))
            }
        })
    }

    createMovie(title, content, rate){
        this.movies = [
            ...this.movies,
            new Movie(title, content, rate)
        ]
    }

    getMoviesIndex(id){
        return this.movies.findIndex((movie) => movie.id === id)
    }

    deleteMovie(id){
        this.movies.splice(this.getMoviesIndex(id), 1);
    }

    editMovie(id, title, content) {
        this.movies[this.getMoviesIndex(id)].title = title
        this.movies[this.getMoviesIndex(id)].content = content
    }

    editRate(id, rate){
        this.movies[this.getMoviesIndex(id)].rate = rate
    }

    initLocalStorage(){
        if(window.localStorage[this.id] == null){
            this.localStorage = window.localStorage;
            this.localStorage.setItem(this.id, JSON.stringify(this.movies.shift()))
            console.log(this.movies)
        }else{
            this.localStorage = window.localStorage;
            this.loadLocalStorage()
        }
    }

    loadLocalStorage(){
        this.movies = JSON.parse(this.localStorage.getItem(this.id))
    }
}