import tkinter as tk
from tkinter import simpledialog, messagebox, scrolledtext
import xmlrpc.client

s = xmlrpc.client.ServerProxy('http://localhost:8000')

class NoteApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Notebook Client")
        self.geometry("400x300")

        self.create_widgets()

    def create_widgets(self):
        # Add Note Button
        self.add_note_button = tk.Button(self, text="Add Note", command=self.add_note)
        self.add_note_button.pack(pady=5)

        # Get Notes Button
        self.get_notes_button = tk.Button(self, text="Get Notes", command=self.get_notes)
        self.get_notes_button.pack(pady=5)

        # Query Wikipedia Button
        self.query_wiki_button = tk.Button(self, text="Query Wikipedia", command=self.query_wikipedia)
        self.query_wiki_button.pack(pady=5)

    def add_note(self):
        topic = simpledialog.askstring("Input", "Enter the topic:", parent=self)
        text = simpledialog.askstring("Input", "Enter text for the note:", parent=self)
        timestamp = simpledialog.askstring("Input", "Enter timestamp (YYYY-MM-DD):", parent=self)
        result = s.add_note(topic, text, timestamp)
        messagebox.showinfo("Result", "Note added successfully" if result else "Failed to add note")

    def get_notes(self):
        topic = simpledialog.askstring("Input", "Enter the topic to fetch notes:", parent=self)
        notes = s.get_notes(topic)
        self.show_notes(notes)

    def show_notes(self, notes):
        notes_window = tk.Toplevel(self)
        notes_window.title("Notes")
        notes_text = scrolledtext.ScrolledText(notes_window, wrap=tk.WORD, width=50, height=10)
        notes_text.insert(tk.INSERT, notes)
        notes_text.pack()

    def query_wikipedia(self):
        topic = simpledialog.askstring("Input", "Enter the topic to search on Wikipedia:", parent=self)
        result = s.query_wikipedia(topic)
        messagebox.showinfo("Wikipedia Result", result)

if __name__ == "__main__":
    app = NoteApp()
    app.mainloop()
