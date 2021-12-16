import base64
import requests
import psycopg2

conn = psycopg2.connect(
    host="127.0.0.1",
    port="5432",
    database="postgres",
    user="prod-sql@split-327923.iam",
    password="autofill")

# def hello_pubsub(event, context):
#     """Triggered from a message on a Cloud Pub/Sub topic.
#     Args:
#          event (dict): Event payload.
#          context (google.cloud.functions.Context): Metadata for the event.
#     """
#     pubsub_message = base64.b64decode(event['data']).decode('utf-8')
#     print(pubsub_message)

def main():
    #TODO Move this into hello_pubsub
    #TODO remove print statements and optimize for space and time to avoid overcharging

    get_articles()
    get_sources()

    conn.close()

def get_articles():
    print('Article Trigger (get_articles) >> Getting Articles')

    # Read Uncommitted isolation level because no selections are done
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_READ_UNCOMMITTED)
    cursor = conn.cursor()

    response = requests.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=1bc453697e0d401cb916ebef3bad313f')
    response_json = response.json()

    status_code = response.status_code
    status = response_json['status']

    if status_code != 200 or status != 'ok':
        print('Article Trigger (get_articles) !! ERR: Status', status)
        return

    articles = response_json['articles']

    cursor.execute("""CREATE EXTENSION IF NOT EXISTS "uuid-ossp";""")
    print('Article Trigger (get_articles) >> Adding UUID extension if not already added')

    cursor.execute("""CREATE TABLE IF NOT EXISTS articles(
                    article_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY, 
                    source_id VARCHAR(255), 
                    topic_id INT, 
                    title VARCHAR(255), 
                    url VARCHAR(255), 
                    pub_date TIMESTAMP);""")
    print('Article Trigger (get_articles) >> Creating articles table if not already created')

    cursor.execute("""DELETE FROM articles;""")
    print('Article Trigger (get_articles) >> Clearing out all rows to avoid duplicate articles')

    for article in articles:
        cursor.execute("INSERT INTO articles(source_id, topic_id, title, url, pub_date) VALUES (%s, %s, %s, %s, %s)",
                       (article['source']['id'], 0, article['title'], article['url'], article['publishedAt']))
        print('Article Trigger (get_articles) >> Adding', ('unique uuid', article['source']['id'], 0, article['title'], article['url'], article['publishedAt']))

    conn.commit()

    cursor.close()

def get_sources():
    print('Article Trigger (get_sources) >> Getting Sources')

    # Read Uncommitted isolation level because no selections are done
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_READ_UNCOMMITTED)
    cursor = conn.cursor()

    response = requests.get('https://newsapi.org/v2/top-headlines/sources?apiKey=1bc453697e0d401cb916ebef3bad313f')
    response_json = response.json()

    status_code = response.status_code
    status = response_json['status']

    if status_code != 200 or status != 'ok':
        print('Article Trigger (get_sources) !! ERR: Status', status)

    sources = response_json['sources']

    cursor.execute("""CREATE TABLE IF NOT EXISTS sources(
                    source_id VARCHAR(255) PRIMARY KEY, 
                    name VARCHAR(255), 
                    homepage_url VARCHAR(255), 
                    country VARCHAR(2),
                    bias INT, 
                    popularity INT);""")
    print('Article Trigger (get_sources) >> Creating sources table if not already created')

    cursor.execute("""DELETE FROM sources;""")
    print('Article Trigger (get_sources) >> Clearing out all rows to avoid duplicate sources')

    for source in sources:
        cursor.execute("""INSERT INTO sources(source_id, name, homepage_url, country) VALUES (%s, %s, %s, %s)""",
                       (source['id'], source['name'], source['url'], source['country']))
        print('Article Trigger (get_sources) >> Adding', (source['id'], source['name'], source['url'], source['country']))


    conn.commit()

    cursor.close()

main()