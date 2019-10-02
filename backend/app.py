from flask import Flask, jsonify, request
from elasticsearch_dsl import Search
from elasticsearch_dsl.connections import connections
from datetime import datetime
from collections import defaultdict

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

    # on empty query, match any document
    if not query:
        _query = {"match_all": {}}
    else:
        _query = {   
            "bool": {
                "must": [
                    {"query_string": {"query": query}},
                ],
            }
        }

    search_dict = {
        "from": 0,
        "query": _query,
        "post_filter": {
            "bool": {"must": []}
        },
        "aggregations": {
            "date": {
                "date_histogram": {
                    "field": "date", "interval": "day",
                },
            },
            "wordcloud": {
                "significant_terms": {
                    "field": "body",
                    "mutual_information": {},
                    "size": 50,
                },
            },
            "topics": {
                "terms": {"field": "topics"},
            },
            "places": {
                "terms": {"field": "places"},
            },
            "orgs": {
                "terms": {"field": "orgs"},
            },
            "exchanges": {
                "terms": {"field": "exchanges"},
            },
            "companies": {
                "terms": {"field": "companies"},
            },
            "people": {
                "terms": {"field": "people"},
            }
        },
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

    # create bar for every month of the year
    barchart = [0 for i in range(12)]
    
    for bucket in search_result.aggregations.date.buckets:
        barchart[datetime.fromtimestamp(bucket.key / 1000).month] += bucket.doc_count 

    facets = {
            "topics": [
                {"name": bucket.key, "count": bucket.doc_count}
                for bucket in search_result.aggregations.topics.buckets
            ],
            "places": [
                {"name": bucket.key, "count": bucket.doc_count}
                for bucket in search_result.aggregations.places.buckets
            ],
            "people": [
                {"name": bucket.key, "count": bucket.doc_count}
                for bucket in search_result.aggregations.people.buckets
            ],
            "companies": [
                {"name": bucket.key, "count": bucket.doc_count}
                for bucket in search_result.aggregations.companies.buckets
            ],
            "orgs": [
                {"name": bucket.key, "count": bucket.doc_count}
                for bucket in search_result.aggregations.orgs.buckets
            ],
            "exchanges": [
                {"name": bucket.key, "count": bucket.doc_count}
                for bucket in search_result.aggregations.exchanges.buckets
            ],
        }

    response = []

    wordcloud = [{"text": bucket.key, "value": bucket.doc_count}
             for bucket in search_result.aggregations.wordcloud.buckets]

    for hit in search_result:
        result = {
            "title": hit.title.replace("<", "").replace(">", ""),
            "summary": hit.body[:252] + "...",
            "date": datetime.fromisoformat(hit.date).strftime("%B %d, %Y"),
            "id": hit.meta.id
        }

        response.append(result)

    return jsonify({
        "data": response,
        "chart": barchart,
        "wordcloud": wordcloud,
        "facets": facets
    })

@app.route("/api/article/<int:article_id>")
def get_article(article_id):
    found = Article.get(id=article_id)

    num_words = len(found.body.split())
    read_time = int(round(num_words/170, 0))

    try:
        topics_list = list(found.topics)
    except:
        topics_list = ["General"]

    try: 
        places_list = list(found.places)
    except:
        places_list = []

    result = {
        "title": found.title.replace("<", "").replace(">", "").lower(),
        "body": found.body.replace("<", "").replace(">", ""),
        "date": found.date.strftime("%B %d, %Y / %I:%M %p"),
        "topics": topics_list,
        "places": places_list,
        "read_time": read_time
    }

    return jsonify(
        result
    )

