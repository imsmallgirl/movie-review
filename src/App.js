import { Button, Rating, TextField } from "@mui/material";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "./components/Card";
import "./App.scss"
import { debounce } from "underscore";

function App({ store }) {
  const [addMovieOn, setAddMovieOn] = useState(false);
  const [rate, setRate] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onChangeTitle = useMemo(() => 
  debounce((e) => 
    setTitle(e.target.value), 500)  
  , []);
  const onChangeContent = useMemo(() => 
    debounce((e) => 
      setContent(e.target.value), 500)
  , []);
  const onChangeRate = useCallback((e, value) => {setRate(value)}, []);

  const onClickAddMovie = useCallback(() => {
    store.createMovie(title, content, rate)
    setAddMovieOn(false)
  }, [store, title, content, rate])

  const Delete = useCallback((id) => store.deleteMovie(id), [store])

  const Edit = useCallback((id, title, content) => store.editMovie(id, title, content), [store])

  const EditRate = useCallback((id, rate) => store.editRate(id, rate), [store])

  useEffect(() => {
    return () => {
      onChangeContent.cancel();
      onChangeTitle.cancel();
    }
  }, [onChangeContent, onChangeTitle])

  return (
    <>
      <div className="movie-review">
        <Button 
        variant="contained" 
        onClick={()=> setAddMovieOn(true)}
        sx={{textAlign:"center", width:"100%"}}
        >
          영화 리뷰 추가하기
        </Button>
        <div>
          {store.movies.map((movie) => (
            <Card key={movie.id} movie={movie} Delete={Delete} Edit={Edit} EditRate={EditRate}/>
          ))}
        </div>
      </div>
      {addMovieOn && 
        <div className="popup-bg">
          <div className="add-movie-popup">
            <TextField 
              id="outlined-basic"
              label="영화 제목"
              variant="outlined"
              sx={{width:"100%"}}
              onChange={onChangeTitle}
            />
            <TextField
              id="outlined-multiline-static"
              label="review"
              multiline
              rows={4}
              placeholder="영화 리뷰를 작성해주세요."
              sx={{width:"100%"}}
              onChange={onChangeContent}
            />
            <Rating
              name="simple-controlled"
              defaultValue={0}
              onChange={onChangeRate}
            />
            <div className="popup-btns">
              <Button variant="outlined" onClick={() => setAddMovieOn(false)}>Cancel</Button>
              <Button variant="contained" onClick={onClickAddMovie}>OK</Button>
            </div>
          </div>
        </div>
        }
    </>

  );
}

export default observer(App);
