import React from "react";
import noteContext from "../context/notes/noteContext";
import { useContext } from "react";
import { useState } from "react";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const [note, setNote] = useState({ title: "", description: "", tag: "" });
  const handleClick = async (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    props.showAlert("Note Added Successfully", "success");
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
    <div>
      <div>
        <h2 className="text-center">{`Hello Sabeeh ! Welcome to iNotebook: `}</h2>
        <h4 className="text-center">
          Where Ideas Begin and Thoughts Take Shape!
        </h4>
      </div>
      <div className="d-flex  align-items-center justify-content-center">
        <div
          className="card my-4"
          style={{
            background : "rgba(185, 185, 185, 0.23)",
            borderRadius : "16px",
            boxShadow : "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter : "blur(4.7px)",
            WebkitBackdropFilter : "blur(4.7px)",
            border :  " 1px solid rgba(185, 185, 185, 0.14)",
            width: "60%",
            borderRadius: "20px",
            padding: "20px 20px",
          }}
        >
          <div className="card-body my-3 mx-3">
            <h2 className="text-center">Add a Note</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  aria-describedby="emailHelp"
                  onChange={onChange}
                  minLength={5}
                  required
                  value={note.title}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  onChange={onChange}
                  minLength={5}
                  required
                  value={note.description}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tag" className="form-label">
                  Tag:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tag"
                  name="tag"
                  onChange={onChange}
                  minLength={5}
                  required
                  value={note.tag}
                />
              </div>
              <button
                disabled={note.title.length < 5 || note.description.length < 5}
                type="submit"
                className="btn btn-primary"
                onClick={handleClick}
              >
                Add Note
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default AddNote;
