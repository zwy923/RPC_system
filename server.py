from xmlrpc.server import SimpleXMLRPCServer, SimpleXMLRPCRequestHandler
from socketserver import ThreadingMixIn
import xml.etree.ElementTree as ET
import requests

class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ('/RPC2',)

class ThreadedXMLRPCServer(ThreadingMixIn, SimpleXMLRPCServer):
    pass

def add_note(topic, name, text, timestamp):
    try:
        tree = ET.parse('db.xml')
        root = tree.getroot()
    except FileNotFoundError:
        root = ET.Element('data')
        tree = ET.ElementTree(root)

    # check if the topic exists and append the note to it
    topic_element = None
    for t in root.findall('topic'):
        if t.attrib['name'] == topic:
            topic_element = t
            break
    
    if not topic_element:
        topic_element = ET.SubElement(root, 'topic', {'name': topic})

    note_element = ET.SubElement(topic_element, 'note', {'name': name})
    ET.SubElement(note_element, 'text').text = text
    ET.SubElement(note_element, 'timestamp').text = timestamp
    
    tree.write('db.xml')
    return True

def query_wikipedia(topic):
    try:
        response = requests.get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{topic}")
        if response.status_code == 200:
            data = response.json()
            return data.get('extract'), data.get('content_urls', {}).get('desktop', {}).get('page')
        else:
            return "No Wikipedia page found for this topic.", ""
    except requests.RequestException:
        return "Failed to connect to Wikipedia.", ""


def get_notes(topic):
    try:
        tree = ET.parse('db.xml')
        root = tree.getroot()
    except FileNotFoundError:
        return "No db found."

    notes_list = []
    for t in root.findall('topic'):
        if t.attrib['name'] == topic:
            for note in t.findall('note'):
                notes_dict = {}
                notes_dict['name'] = note.attrib['name']
                notes_dict['text'] = note.find('text').text
                notes_dict['timestamp'] = note.find('timestamp').text
                notes_list.append(notes_dict)
            return notes_list
    return "Topic not found."

server = ThreadedXMLRPCServer(('localhost', 1234), requestHandler=RequestHandler)
print("Server running")
server.register_function(add_note, "add_note")
server.register_function(query_wikipedia, "query_wikipedia")
server.register_function(get_notes, "get_notes")

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("Shutting down server.")
    server.server_close()

