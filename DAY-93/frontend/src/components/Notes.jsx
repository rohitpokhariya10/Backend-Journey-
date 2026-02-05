import { useEffect, useState } from "react";
import axios from "axios";

export default function Notes() {
  // Notes list
  const [notes, setNotes] = useState([]);

  // Create note states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Edit note states
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  //react ko btana ki konsa note edit mode pe hai(kis note ke edit button me click kra hai)
  const [editingNoteId, setEditingNoteId] = useState(null);

  // ---------------- FETCH NOTES ----------------
  async function fetchNotes() {
    try {
      const response = await axios.get("https://backend-journey-1-ivt1.onrender.com/api/notes");
      setNotes(response.data.note);
    } catch (error) {
      console.log("❌ Error:", error.message);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  // ---------------- ADD NOTE ----------------
  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Title and Description both are required");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend-journey-1-ivt1.onrender.com/api/notes",
        {
          title: title.trim(),
          description: description.trim(),
        }
      );

      const newNote = response.data.note;
      setNotes((prev) => [newNote, ...prev]);

      setTitle("");
      setDescription("");
    } catch (error) {
      console.log("❌ Error:", error.message);
    }
  };

  // ---------------- DELETE NOTE ----------------
  async function handleDelete(noteId) {
    await axios.delete(`https://backend-journey-1-ivt1.onrender.com/api/notes/${noteId}`);

    setNotes((prevNotes) =>
      prevNotes.filter((note) => note._id !== noteId)
    );
  }

  // ---------------- START EDIT ----------------
  function startEdit(note) {
    console.log(note);
    
    setEditingNoteId(note._id);
    //user jab edit title pe click krega tu use purana title description dikhega fir edit krega use
    setEditTitle(note.title);
    setEditDescription(note.description);
  }

  // ---------------- SAVE EDIT ----------------
 async function handleEdit(noteId) {
  if (!editTitle.trim() || !editDescription.trim()) {
    alert("Title & Description empty nahi ho sakte");
    return;
  }

  try {
    await axios.patch(
      `https://backend-journey-1-ivt1.onrender.com/api/notes/${noteId}`,
      {
        title: editTitle,
        description: editDescription,
      }
    );

    
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === noteId
          ? {
              ...note,
              title: editTitle,
              description: editDescription,
            }
          : note
      )
    );

    setEditingNoteId(null);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}


  return (
    <div className="app">
      {/* Top Header */}
      <header className="topbar">
        <div className="brand">
          <div className="logo">N</div>
          <div>
            <h1>Notes</h1>
            <p>
              Simple notes UI (dummy data) • Just for practising Frontend and
              Backend Integration
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {/* Left Panel (Add Note Form) */}
        <section className="panel">
          <div className="panelHeader">
            <h2>Create Note</h2>
          </div>

          <form className="form" onSubmit={handleAddNote}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Description</label>
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
              Showing <b>{notes.length}</b> of <b>{notes.length}</b>
            </p>
          </div>

          {notes.length === 0 ? (
            <div className="emptyState">
              <h3>No notes found 😅</h3>
              <p>Try creating a new note.</p>
            </div>
          ) : (
            <div className="grid">
              {
              notes.map((note) => (
                <div className="card" key={note._id}>
                  <div className="cardTop">
                    {
                    editingNoteId === note._id ? (
                      <input
                        className="editInput"
                        placeholder="Enter edit title..."
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(e.target.value)
                        }
                      />
                    ) : (
                      <h3 title={note.title}>{note.title}</h3>
                    )
                    }

                    <button
                      className="iconBtn"
                      onClick={() => handleDelete(note._id)}
                      title="Delete Note"
                    >
                      ✕
                    </button>
                  </div>

                  {
                  editingNoteId === note._id ? (
                    <textarea
                      className="editTextarea"
                      placeholder="Enter edit description..."
                      value={editDescription}
                      onChange={(e) =>
                      setEditDescription(e.target.value)
                      }
                    />
                  ) : (
                    <p className="desc">{note.description}</p>
                  )
                  }

                  <div className="cardFooter">
                    <div>
                      <span className="pill">Title</span>
                      <span className="pill">Description</span>
                    </div>

                    <button
                      className="iconEdit"
                      onClick={() =>
                        editingNoteId === note._id
                          ? handleEdit(note._id)
                          : startEdit(note)
                      }
                      title={
                        editingNoteId === note._id
                          ? "Save Note"
                          : "Edit Note"
                      }
                    >
                      <i
                        className={
                          editingNoteId === note._id
                            ? "ri-save-line"
                            : "ri-edit-line"
                        }
                      ></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
