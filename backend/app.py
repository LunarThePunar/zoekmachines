from flask import Flask, jsonify, request
from elasticsearch_dsl import Search
from elasticsearch_dsl.connections import connections

connections.create_connection(hosts=["localhost"])

app = Flask(__name__)

@app.route("/api/people")
def people():
    """
    Returns the list of all people present in the dataset
    this is used to populate the lists in advanced search option
    in frontend
    """
    with open("../data/people", "r") as f:
        people = [name.replace("\n", "") for name in f.readlines()]

        return jsonify(people)

@app.route("/api/orgs")
def orgs():
    """
    Returns the list of all orgs present in the dataset
    this is used to populate the lists in advanced search option
    in frontend
    """
    with open("../data/orgs", "r") as f:
        orgs = [name.replace("\n", "") for name in f.readlines()]

        return jsonify(orgs)

@app.route("/api/exchanges")
def exchanges():
    """
    Returns the list of all exchanges present in the dataset
    this is used to populate the lists in advanced search option
    in frontend
    """
    with open("../data/exchanges", "r") as f:
        exchanges = [name.replace("\n", "") for name in f.readlines()]

        return jsonify(exchanges)

@app.route("/api/places")
def places():
    """
    Returns the list of all places present in the dataset
    this is used to populate the lists in advanced search option
    in frontend
    """
    with open("../data/places", "r") as f:
        places = [name.replace("\n", "") for name in f.readlines()]

        return jsonify(places)

@app.route("/api/topics")
def topics():
    """
    Returns the list of all topics present in the dataset
    this is used to populate the lists in advanced search option
    in frontend
    """
    with open("../data/topics", "r") as f:
        topics = [name.replace("\n", "") for name in f.readlines()]

        return jsonify(topics)

@app.route("/api/search", methods = ["POST"])
def search():
    data = request.get_json()
    query = data['query']

    people = data['people']
    exchanges = data['exchanges']
    orgs = data['orgs']
    places = data['places']
    topics = data['topics']

    search_dict = {
        "from": 0,
        "query": {
            "bool": {
                "must": [
                    {"query_string": {"query": query}},
                ],
            }
        }
    }

    search = Search.from_dict(search_dict)
    response = search.execute()

    print(response)

    return ""
