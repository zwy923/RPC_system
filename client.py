import xmlrpc.client

s = xmlrpc.client.ServerProxy('http://localhost:8000')

def add_note():
    topic = input("Enter the topic: ")
    text = input("Enter text for the note: ")
    timestamp = input("Enter timestamp (YYYY-MM-DD): ")
    print(s.add_note(topic, text, timestamp))

def get_notes():
    topic = input("Enter the topic to fetch notes: ")
    print(s.get_notes(topic))

def query_wikipedia():
    topic = input("Enter the topic to search on Wikipedia: ")
    print(s.query_wikipedia(topic))

def main():
    while True:
        print("\nOptions: 1) Add note 2) Get notes 3) Query Wikipedia 4) Exit")
        choice = input("Enter your choice: ")
        if choice == '1':
            add_note()
        elif choice == '2':
            get_notes()
        elif choice == '3':
            query_wikipedia()
        elif choice == '4':
            break
        else:
            print("Invalid choice.")

if __name__ == '__main__':
    main()
