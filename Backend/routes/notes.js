const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../modules/Note");
const { body, validationResult } = require("express-validator");

// ROUTER:1  Get all the notes by using: GET /api/notes/fetchallnotes Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTER:2  Add a note by using: POST /api/notes/addnote Login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title").isLength({ min: 3 }).withMessage("Enter a valid Title"),
    body("description").isLength({ min: 3 }).withMessage("Enter a valid Description"),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTER:3  Update an existing note by using: PUT /api/notes/updatenote Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    // Extracting note fields from the request body
    const { title, description, tag } = req.body;
    const newNote = {};
    
    // Only add fields to newNote if they are provided
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    // Finding the note by ID
    let note = await Note.findById(req.params.id);

    // If note doesn't exist, return a 404 error
    if (!note) {
      return res.status(404).send("Note not found");
    }

    // Verify that the user is authorized to update the note
    if (note.user.toString() !== req.user.id) {
      return res.status(403).send("Access denied. You are not allowed to modify this note.");
    }

    // Update the note
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

    // Return the updated note as JSON
    res.json(note);

  } catch (error) {
    // Log the error message and return a 500 error
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// ROUTER:4  Delete an existing note by using: DELETE /api/notes/deletenote Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        // Finding the note to be delete and delete it
        let note = await Note.findById(req.params.id)
        if(!note){return res.status(404).send("Not Found")}

        // Verifying the User
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "The Note has been deleted" , note : note})

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

module.exports = router;
