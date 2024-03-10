import sys
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QLineEdit, QPushButton, QTextEdit
import xmlrpc.client

class NotesClient(QWidget):
    def __init__(self):
        super().__init__()
        self.server = xmlrpc.client.ServerProxy('http://localhost:1234')
        self.initUI()

    def getNotesForTopic(self):
        topic = self.topicInput.text()
        if not topic:
            self.notesDisplay.setText("Please enter a topic to fetch notes.")
            return
        notes = self.server.get_notes(topic)
        if notes:
            displayText = ""
            for note in notes:
                displayText += f"Title: {note['name']}\nTimestamp: {note['timestamp']}\nNote: {note['text']}\n\n"
            self.notesDisplay.setText(displayText)
        else:
            self.notesDisplay.setText("No notes found for this topic.")

    
    def initUI(self):
        self.setWindowTitle('Wenyue Zhang RPC client')
        self.setGeometry(150, 150, 900, 700)

        layout = QVBoxLayout()

        self.topicInput = QLineEdit(self)
        self.topicInput.setPlaceholderText('Topic')
        layout.addWidget(self.topicInput)

        self.nameInput = QLineEdit(self)
        self.nameInput.setPlaceholderText('Note Title')
        layout.addWidget(self.nameInput)

        self.textInput = QTextEdit(self)
        self.textInput.setPlaceholderText('Write note here...')
        layout.addWidget(self.textInput)

        self.timestampInput = QLineEdit(self)
        self.timestampInput.setPlaceholderText('Timestamp (MM/DD/YY - HH:MM:SS)')
        layout.addWidget(self.timestampInput)

        addButton = QPushButton('Add Note', self)
        addButton.clicked.connect(self.addNote)
        layout.addWidget(addButton)

        getNotesButton = QPushButton('Get Notes for Topic', self)
        getNotesButton.clicked.connect(self.getNotesForTopic)
        layout.addWidget(getNotesButton)
        
        wikiButton = QPushButton('Query Wikipedia by topic', self)
        wikiButton.clicked.connect(self.queryWikipedia)
        layout.addWidget(wikiButton)
        
        self.notesDisplay = QTextEdit(self)
        self.notesDisplay.setReadOnly(True)
        layout.addWidget(self.notesDisplay)

        self.setLayout(layout)


    def displayNotes(self):
        topic = self.topicInput.text()
        notes = self.server.get_notes(topic)
        if isinstance(notes, list):
            notes_str = '\n'.join([f"{note['name']} ({note['timestamp']}): {note['text']}" for note in notes])
            self.notesDisplay.setText(notes_str)
        else:
            self.notesDisplay.setText(notes)

    def addNote(self):
        topic = self.topicInput.text()
        name = self.nameInput.text()
        text = self.textInput.toPlainText()
        timestamp = self.timestampInput.text()
        if self.server.add_note(topic, name, text, timestamp):
            self.notesDisplay.setText(f"Note added to topic: {topic}")
        else:
            self.notesDisplay.setText("Failed to add note.")

    def queryWikipedia(self):
        topic = self.topicInput.text()
        extract, page = self.server.query_wikipedia(topic)
        if extract and page:
            displayText = f"{extract}\nLink: {page}"
        else:
            displayText = extract 
        self.notesDisplay.setText(displayText)

def main():
    app = QApplication(sys.argv)
    client = NotesClient()
    client.show()
    sys.exit(app.exec_())

if __name__ == '__main__':
    main()


