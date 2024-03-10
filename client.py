from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QMessageBox, QLineEdit, QTextEdit
import xmlrpc.client
import sys

try:
    s = xmlrpc.client.ServerProxy('http://localhost:8000', allow_none=True, use_builtin_types=True, timeout=10)
except Exception as e:
    print(f"Failed to connect to server: {e}")
    sys.exit(1)

class NoteApp(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()
    
    def initUI(self):
        self.setWindowTitle('Notebook Client with Wikipedia Search')
        self.setGeometry(100, 100, 600, 400)

        layout = QVBoxLayout()

        self.topic_input = QLineEdit(self, placeholderText="Enter a topic")
        layout.addWidget(self.topic_input)

        self.note_text = QTextEdit(self, placeholderText="Enter note text here")
        layout.addWidget(self.note_text)

        self.timestamp_input = QLineEdit(self, placeholderText="Enter timestamp (YYYY-MM-DD)")
        layout.addWidget(self.timestamp_input)

        add_note_btn = QPushButton('Add Note', self)
        add_note_btn.clicked.connect(self.add_note)
        layout.addWidget(add_note_btn)

        get_notes_btn = QPushButton('Get Notes', self)
        get_notes_btn.clicked.connect(self.get_notes)
        layout.addWidget(get_notes_btn)

        wiki_search_btn = QPushButton('Query Wikipedia', self)
        wiki_search_btn.clicked.connect(self.query_wikipedia)
        layout.addWidget(wiki_search_btn)

        self.setLayout(layout)

    def add_note(self):
        topic = self.topic_input.text()
        text = self.note_text.toPlainText()
        timestamp = self.timestamp_input.text()
        result = s.add_note(topic, text, timestamp)
        QMessageBox.information(self, 'Add Note', 'Note added successfully' if result else 'Failed to add note')

    def get_notes(self):
        topic = self.topic_input.text()
        notes = s.get_notes(topic)
        QMessageBox.information(self, 'Notes', notes)

    def query_wikipedia(self):
        topic = self.topic_input.text()
        try:
            result = s.query_wikipedia(topic)
            if 'error' not in result:
                info = f"Title: {result['title']}\n\nSummary: {result['extract']}\n\nURL: {result['url']}"
                QMessageBox.information(self, 'Wikipedia Result', info)
            else:
                QMessageBox.warning(self, 'Error', result['error'])
        except Exception as e:
            QMessageBox.critical(self, 'RPC Error', f"Failed to query Wikipedia: {e}")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = NoteApp()
    ex.show()
    sys.exit(app.exec_())

