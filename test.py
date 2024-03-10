import xmlrpc.client
import threading

def client_task(task_id, topic, text, timestamp):
    s = xmlrpc.client.ServerProxy('http://localhost:8000')
    result = s.add_note(topic + f" {task_id}", text, timestamp)
    print(f"Task {task_id}: Note added result ->", result)
    
def main():
    threads = []
    for i in range(5):
        topic = "Test Topic"
        text = f"Test Note from client {i}"
        timestamp = "2024-03-10"
        thread = threading.Thread(target=client_task, args=(i, topic, text, timestamp))
        threads.append(thread)
        thread.start()
    
    for thread in threads:
        thread.join()

if __name__ == "__main__":
    main()
