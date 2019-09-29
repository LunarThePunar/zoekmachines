from elasticsearch_dsl.connections import connections
connections.create_connection(hosts=['localhost'])

from bs4 import BeautifulSoup
from datetime import datetime

from article import Article


def get_list_from_tag(text, tag):
    output = []

    for i in text.find(tag).find_all("d"):
        output.append(i.text)
    return output


Article.init()

with open("../reuters21578/reut2-000.sgm", "r") as f:
    s = f.read()
    soup = BeautifulSoup(s,'html.parser')

    # loop over all articles in this soup
    for i in soup.find_all("reuters"):
        current_id = int(i['newid'])

        text = i.find("text")

        # check if the text should be processed
        try:
            if text["type"] == "UNPROC":
                continue
        except:
            pass
        
        # get the data contained in the text field
        title = text.find("title").text
        dateline = text.find("dateline").text
        body = text.find("body").text

        # get the date of the article
        date_string = i.find('date').text.strip()
        time = datetime.strptime(date_string, '%d-%b-%Y %H:%M:%S.%f')

        # create a lists of listable tags
        topics = get_list_from_tag(i, "topics")
        places = get_list_from_tag(i, "places")
        people = get_list_from_tag(i, "people")
        orgs = get_list_from_tag(i, "orgs")
        exchanges = get_list_from_tag(i, "exchanges")
        companies = get_list_from_tag(i, "companies")

        article = Article(meta={'id': current_id}, 
                          title=title,
                          body=body,
                          topics=topics,
                          places=places,
                          people=people,
                          orgs=orgs,
                          exchanges=exchanges,
                          companies=companies,
                          date=time)

        print(article)

        



