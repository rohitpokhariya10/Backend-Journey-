import React, { useEffect, useMemo, useState } from "react";
import axios from 'axios'
export default function Notes() {
    const [notes, setNotes] = useState([
   
    ]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [search, setSearch] = useState("");

    const filteredNotes = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return notes;

        return notes.filter((n) => {
            return (
                n.title.toLowerCase().includes(q) ||
                n.description.toLowerCase().includes(q)
            );
        });
    }, [notes, search]);

    const handleAddNote = (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            alert("Title and Description both are required ✅");
            return;
        }

        const newNote = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
        };

        setNotes((prev) => [newNote, ...prev]);
        setTitle("");
        setDescription("");
    };

    const handleDelete = (id) => {
        const ok = confirm("Delete this note?");
        if (!ok) return;

        setNotes((prev) => prev.filter((n) => n.id !== id));
    };

    useEffect(() => {
        async function  fetchNotes(){
         try{
             const response =  await  axios.get("http://localhost:3000/api/notes")
          setNotes(response.data.note)
         }
         catch(error){
            onsole.log("❌ Error:", error.message);
         }
        }
        fetchNotes()
           
    }, []);


    return (
        <div className="app">
            {/* Top Header */}
            <header className="topbar">
                <div className="brand">
                    <div className="logo">N</div>
                    <div>
                        <h1>Notes</h1>
                        <p>Simple notes UI (dummy data) • Just for practising Frontend and Backend Integration</p>
                    </div>
                </div>

                <div className="searchBox">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>
            </header>

            {/* Main */}
            <main className="main">
                {/* Left Panel (Add Note Form) */}
                <section className="panel">
                    <div className="panelHeader">
                        <h2>Create Note</h2>
                        {/* <span className="badge">Frontend Only</span> */}
                    </div>

                    <form className="form" onSubmit={handleAddNote}>
                        <label>
                            Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />


                        <label>
                            Description
                        </label>
                        <textarea
                            placeholder="Enter description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />


                        <button className="btn" type="submit">
                            + Add Note
                        </button>
                    </form>
                </section>

                {/* Right Panel (Notes List) */}
                <section className="notesSection">
                    <div className="notesHeader">
                        <h2>Your Notes</h2>
                        <p>
                            Showing <b>{filteredNotes.length}</b> of <b>{notes.length}</b>
                        </p>
                    </div>

                    {filteredNotes.length === 0 ? (
                        <div className="emptyState">
                            <h3>No notes found 😅</h3>
                            <p>Try searching something else or create a new note.</p>
                        </div>
                    ) : (
                        <div className="grid">
                            
                                {
                                    filteredNotes.map((note) => (
                                       
                                        <div className="card" key={note._id }>
                                            {/* backend se jo note ki id ati hai vo _id ke name se ati hai */}
                                           { console.log(note)}
                                            <div className="cardTop">
                                                <h3 title={note.title}>{note.title}</h3>

                                                <button
                                                    className="iconBtn"
                                                    onClick={() => handleDelete(note._id )}
                                                    title="Delete Note"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <p className="desc">{note.description}</p>

                                            <div className="cardFooter">
                                                <span className="pill">Title</span>
                                                <span className="pill">Description</span>
                                            </div>
                                        </div>
                                    ))
                                }

                            
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
