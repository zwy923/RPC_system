import threading
import xmlrpc.client

def client_thread(thread_id):
    server = xmlrpc.client.ServerProxy('http://localhost:1234', allow_none=True)
    response = server.get_notes("Animal Things")
    print(f"Thread {thread_id}: Response from server: {response}/n")

threads = []
for i in range(5): # create 5 threads to test the funcation get_notes()
    t = threading.Thread(target=client_thread, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
