const db = require("../db/db");
const path = require("path");
const fs = require("fs");
//used to read or write into the file
const createDb = path.resolve(__dirname, "../db/db.json");

module.exports = function(app) {
    //Getting all notes from notes json file
    app.get("/api/notes", (req, res) => {
        let dbNotes = fs.readFileSync(path.resolve(createDb), "utf8");
        res.json(JSON.parse(dbNotes));
    });
    //Posting new note to notes json file
    app.post("/api/notes", (req, res) => {
        const notes = [];
        //updating notes[] with db.json values
        db.forEach(element => {
            notes.push(element);
        });
        //adding new note into notes array
        const newNote = req.body;
        let id = 0;
        if(notes.length > 0)
            id  = notes[notes.length-1].id;
        newNote.id = id + 1;
        notes.push(newNote);
        //write to file db.json
        fs.writeFileSync(createDb,JSON.stringify(notes), (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
        });
        res.json(newNote);            
    });
    //delting a note from notes json file
    app.delete("/api/notes/:id", (req, res) => {
        const notes = [];
        //updating notes[] with db.json values
        db.forEach(element => {
            notes.push(element);
        });
        const noteId =req.params.id;
        notes.forEach((note, i) => {
            if(noteId == note.id){
                notes.splice(i,1);
                console.log(`Record "${note.title}" is deleted`); 
                //write to file db.json
                fs.writeFileSync(createDb,JSON.stringify(notes), (err) => {
                    // throws an error, you could also catch it here
                    if (err) throw err;
                });
                res.json(notes);
            }
        });
    });
}