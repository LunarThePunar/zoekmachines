from elasticsearch_dsl import Document, Date, Keyword, Text, Boolean

class Article(Document):
    date = Date()
    title = Text(analyzer="snowball")
    body = Text(
        analyzer="snowball",
        fielddata=True,
    )

    topics = Keyword()
    places = Keyword()
    people = Keyword()
    orgs = Keyword()
    exchanges = Keyword()
    companies = Keyword()

    def save(self, ** kwargs):
        self.lines = len(self.body.split())
        return super(Article, self).save(** kwargs)

