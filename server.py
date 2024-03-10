from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler
import xml.etree.ElementTree as ET
from urllib.request import urlopen
import xmlrpc.client
import json

class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ('/RPC2',)

# Create server
with SimpleXMLRPCServer(('localhost', 8000),
                        requestHandler=RequestHandler) as server:
    server.register_introspection_functions()

    try:
        tree = ET.parse('notes_database.xml')
        root = tree.getroot()
    except FileNotFoundError:
        root = ET.Element("notes")
        tree = ET.ElementTree(root)

    def add_note(topic, text, timestamp):
        for child in root:
            if child.tag == 'note' and child.find('topic').text == topic:
                ET.SubElement(child, "entry", timestamp=timestamp).text = text
                tree.write('notes_database.xml')
                return True
        new_note = ET.SubElement(root, "note")
        ET.SubElement(new_note, "topic").text = topic
        ET.SubElement(new_note, "entry", timestamp=timestamp).text = text
        tree.write('notes_database.xml')
        return True

    def get_notes(topic):
        for child in root:
            if child.tag == 'note' and child.find('topic').text == topic:
                return ET.tostring(child, encoding='unicode')
        return "Topic not found."

    def query_wikipedia(topic):
        try:
            url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{topic}"
            response = urlopen(url)
            data = json.loads(response.read())
            return data.get('content_urls', {}).get('desktop', {}).get('page', 'No URL found.')
        except Exception as e:
            return str(e)

    server.register_function(add_note, 'add_note')
    server.register_function(get_notes, 'get_notes')
    server.register_function(query_wikipedia, 'query_wikipedia')


    print("Server running...")
    server.serve_forever()
