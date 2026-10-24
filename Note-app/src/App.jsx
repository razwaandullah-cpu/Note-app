
import { useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !text.trim()) {
      alert("Please enter both a title and note.");
      return;
    }

    if (editingId !== null) {
      setNotes((previousNotes) =>
        previousNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title,
                text,
                updatedAt: new Date().toLocaleString(),
              }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        title,
        text,
        date: new Date().toLocaleString(),
        updatedAt: null,
      };

      setNotes((previousNotes) => [newNote, ...previousNotes]);
    }

    setTitle("");
    setText("");
    setEditingId(null);
  }

  function handleEdit(e, note) {
    e.stopPropagation();

    setTitle(note.title);
    setText(note.text);
    setEditingId(note.id);
    setSelectedNote(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(e, id) {
    e.stopPropagation();

    setNotes((previousNotes) =>
      previousNotes.filter((note) => note.id !== id)
    );

    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }

    if (editingId === id) {
      cancelEdit();
    }
  }

  function cancelEdit() {
    setTitle("");
    setText("");
    setEditingId(null);
  }

  return (
    <div className="app">
      <header className="header">
        <h1>My Notes</h1>
        <p>Write down your thoughts and keep them safe.</p>
      </header>

      <main className="container">
        <form className="note-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Note title"
          />

          <textarea
            placeholder="Write your note here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="5"
            aria-label="Note content"
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingId !== null ? "Update Note" : "Add Note"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="cancel-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="notes-section">
          <h2>Your Notes ({notes.length})</h2>

          {notes.length === 0 ? (
            <p className="empty-message">
              No notes yet. Create your first note!
            </p>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="note-card"
                  onClick={() => setSelectedNote(note)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open note: ${note.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedNote(note);
                    }
                  }}
                >
                  <div className="card-header">
                    <h3>{note.title}</h3>

                    <div className="card-icons">
                      <span
                        className="icon edit-icon"
                        role="button"
                        tabIndex={0}
                        title="Edit note"
                        aria-label={`Edit ${note.title}`}
                        onClick={(e) => handleEdit(e, note)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleEdit(e, note);
                          }
                        }}
                      >
                        ✏️
                      </span>

                      <span
                        className="icon delete-icon"
                        role="button"
                        tabIndex={0}
                        title="Delete note"
                        aria-label={`Delete ${note.title}`}
                        onClick={(e) => handleDelete(e, note.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleDelete(e, note.id);
                          }
                        }}
                      >
                        🗑️
                      </span>
                    </div>
                  </div>

                  <p className="note-preview">{note.text}</p>

                  <div className="card-footer">
                    <small>Created: {note.date}</small>
                    {note.updatedAt && (
                      <small>Edited: {note.updatedAt}</small>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedNote && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedNote(null)}
        >
          <section
            className="note-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="close-icon"
              role="button"
              tabIndex={0}
              aria-label="Close note"
              onClick={() => setSelectedNote(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedNote(null);
                }
              }}
            >
              ✕
            </span>

            <h2 id="modal-title">{selectedNote.title}</h2>

            <p className="modal-date">
              Created: {selectedNote.date}
            </p>

            {selectedNote.updatedAt && (
              <p className="modal-date">
                Last edited: {selectedNote.updatedAt}
              </p>
            )}

            <div className="full-note">{selectedNote.text}</div>

            <div className="modal-actions">
              <span
                className="icon edit-icon"
                role="button"
                tabIndex={0}
                aria-label="Edit this note"
                onClick={(e) => handleEdit(e, selectedNote)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleEdit(e, selectedNote);
                  }
                }}
              >
                ✏️ Edit
              </span>

              <span
                className="icon delete-icon"
                role="button"
                tabIndex={0}
                aria-label="Delete this note"
                onClick={(e) => handleDelete(e, selectedNote.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleDelete(e, selectedNote.id);
                  }
                }}
              >
                🗑️ Delete
              </span>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;