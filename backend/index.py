import os
import sys
import glob

from elasticsearch_dsl.connections import connections

from bs4 import BeautifulSoup
from datetime import datetime

from article import Article
connections.create_connection(hosts=["localhost"])

Article.init()


def get_list_from_tag(text, tag):
    """
    Helper function to collect multiple sub tags from a tag
    like categories, that are enclosed in <D> tags.
    """
    output = []

    for i in text.find(tag).find_all("d"):
        output.append(i.get_text())
    return output


def index_directory(directory):
    """
    Iterates through all sgm files in the given data directory
    and creates article instances for them in elasticsearch
    """
    files = glob.glob(f"{directory}*.sgm")

    for filename in files:
        print(f"Processing {filename}\r")
        with open(filename, "rb") as f:
            s = f.read()
            soup = BeautifulSoup(s,'html.parser')

            # loop over all articles in this soup
            for i in soup.find_all("reuters"):
                current_id = int(i['newid'])

                text = i.find("text")

                # check if the text should be processed
                try:
                    if text["type"] in ["UNPROC", "BRIEF"]:
                        continue
                except:
                    pass
                
                # get the data contained in the text field
                title = text.find("title").get_text()
                body = text.find("body").get_text()

                # get the date of the article
                date_string = i.find('date').get_text().strip()
                # some files have noise after the date, this strips it off
                # if the date_string is longer than expected
                if len(date_string) > 23:
                    diff = len(date_string) - 23
                    date_string = date_string[:-diff]
                try:
                    time = datetime.strptime(date_string, '%d-%b-%Y %H:%M:%S.%f')
                except ValueError:
                    continue
                    
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
                article.save()
        

if __name__ == "__main__":
    try:
        directory_name = sys.argv[1]
        index_directory(directory_name)
    except IndexError:
        print("Please provide a valid directory")
        exit(1)

