import { IconButton, Rating, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./Card.scss";
import { observer } from "mobx-react";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CheckIcon from "@mui/icons-material/Check";
import { debounce } from "underscore";

function Card({ movie, Delete, Edit, EditRate }) {
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(movie.title);
  const [newContent, setNewContent] = useState(movie.content);

  const onClickDelete = useCallback(() => Delete(movie.id), [Delete, movie.id]);

  const onClickEdit = useCallback(() => {
    setIsEdit(false);
    Edit(movie.id, newTitle, newContent);
  }, [setIsEdit, movie.id, newTitle, newContent, Edit]);

  const onClickEditOn = useCallback(() => {
    setIsEdit(true);
  }, [setIsEdit]);

  const onChangeNewTitle = useMemo(
    () => debounce((e) => setNewTitle(e.target.value), 100),
    []
  );

  const onChangeNewContent = useMemo(
    () => debounce((e) => setNewContent(e.target.value), 300),
    []
  );

  const onChangeNewRate = useCallback(
    (e, newValue) => {
      EditRate(movie.id, newValue);
    },
    [movie.id, EditRate]
  );

  useEffect(() => {
    return () => {
      onChangeNewTitle.cancel();
      onChangeNewContent.cancel();
    };
  }, [onChangeNewTitle, onChangeNewContent]);

  return (
    <div className="card">
      {isEdit ? (
        <div className="card-edit">
          <TextField
            id="outlined-basic"
            label="영화 제목"
            variant="outlined"
            defaultValue={movie.title}
            onChange={onChangeNewTitle}
            sx={{ width: "100%" }}
          />
          <TextField
            id="outlined-multiline-static"
            label="review"
            multiline
            rows={4}
            defaultValue={movie.content}
            onChange={onChangeNewContent}
            sx={{ width: "100%" }}
          />
        </div>
      ) : (
        <dl>
          <dt>{movie.title}</dt>
          <dd>{movie.content}</dd>
        </dl>
      )}

      <Rating
        name="simple-controlled"
        value={movie.rate}
        onChange={onChangeNewRate}
      />
      <div className="card-buttons">
        <IconButton aria-label="delete" color="primary" onClick={onClickDelete}>
          <DeleteIcon />
        </IconButton>
        {isEdit ? (
          <IconButton aria-label="check" color="primary" onClick={onClickEdit}>
            <CheckIcon />
          </IconButton>
        ) : (
          <IconButton
            aria-label="check"
            color="primary"
            onClick={onClickEditOn}
          >
            <DriveFileRenameOutlineIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default observer(Card);
