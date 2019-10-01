from flask import Flask, jsonify, request
from elasticsearch_dsl import Search
from elasticsearch_dsl.connections import connections
from datetime import datetime

from article import Article

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
        people = [name.replace("\n", "").strip() for name in f.readlines()]

        return jsonify(people)

@app.route("/api/orgs")
def orgs():
    """
    Returns the list of all orgs present in the dataset
    this is used to populate the lists in advanced search option
    in frontend
    """
    with open("../data/orgs", "r") as f:
        orgs = [name.replace("\n", "").strip() for name in f.readlines()]

        return jsonify(orgs)

@app.route("/api/exchanges")
def exchanges():
    """
    Returns the list of all exchanges present in the dataset
    this is used to populate the lists in advanced search option
    in frontend
    """
    with open("../data/exchanges", "r") as f:
        exchanges = [name.replace("\n", "").strip() for name in f.readlines()]

        return jsonify(exchanges)

@app.route("/api/places")
def places():
    """
    Returns the list of all places present in the dataset
    this is used to populate the lists in advanced search option
    in frontend
    """
    with open("../data/places", "r") as f:
        places = [name.replace("\n", "").strip() for name in f.readlines()]

        return jsonify(places)

@app.route("/api/topics")
def topics():
    """
    Returns the list of all topics present in the dataset
    this is used to populate the lists in advanced search option
    in frontend
    """
    with open("../data/topics", "r") as f:
        topics = [name.replace("\n", "").strip() for name in f.readlines()]

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
        },
        "post_filter": {
            "bool": {"must": []}
        }
    }

    if topics:
        search_dict['post_filter']['bool']['must'].append(
                {"terms": {"topics": topics}}
            )
    if places:
        search_dict['post_filter']['bool']['must'].append(
                {"terms": {"places": places}}
            )
    if people:
        search_dict['post_filter']['bool']['must'].append(
                {"terms": {"people": people}}
            )
    if orgs:
        search_dict['post_filter']['bool']['must'].append(
                {"terms": {"orgs": orgs}}
            )
    if exchanges:
        search_dict['post_filter']['bool']['must'].append(
                {"terms": {"exchanges": exchanges}}
            )

    s = Search.from_dict(search_dict)
    search_result = s.execute()

    response = []

    for hit in search_result:
        result = {
            "title": hit.title.replace("<", "").replace(">", ""),
            "summary": hit.body[:252] + "...",
            "date": datetime.fromisoformat(hit.date).strftime("%B %d, %Y"),
            "id": hit.meta.id
        }

        response.append(result)

    for hit in search_result:
        print(hit.title, hit.meta.score)

    return jsonify({
        "data": response
    })

@app.route("/article/<int:article_id>")
def get_article(article_id):
    print(article_id)

    found = Article.get(id=article_id)

    num_words = len(found.body.split())
    read_time = int(round(num_words/170, 0))

    result = {
        "title": found.title.replace("<", "").replace(">", "").lower(),
        "body": found.body.replace("<", "").replace(">", ""),
        "date": found.date.strftime("%B %d, %Y / %I:%M %p"),
        "topics": list(found.topics),
        "places": list(found.places),
        "read_time": read_time
    }

    return jsonify(
        result
    )

