import base64
import requests
import psycopg2
import re
import bs4

BIAS_TABLE = {
    "extreme-left": -3,
    "extreme left": -3,
    "left": -2,
    "left-center": -1,
    "left center": -1,
    "center": 0,
    "unbiased": 0,
    "least biased": 0,
    "least-biased": 0,
    "extreme-right": 3,
    "extreme right": 3,
    "right": 2,
    "right-center": 1,
    "right center": 1
}
POP_TABLE = {
    "minimal traffic": 1,
    "medium traffic": 2,
    "high traffic": 3,
}

conn = psycopg2.connect(
    host="127.0.0.1",
    port="5432",
    database="postgres",
    user="prod-sql@split-327923.iam",
    password="autofill")

def main():
    get_bias()

    conn.close()

def get_bias():

    cursor = conn.cursor()

    cursor.execute("""SELECT source_id, name FROM sources WHERE bias IS NULL;""")
    row = cursor.fetchone()

    while row is not None:
        update_cur = conn.cursor()
        info = source_bias(row[1])
        #print("Name: {}, Bias: {}, Pop: {}".format(row[1], info["bias"], info["popularity"]))

        update_cur.execute("""UPDATE sources
                        SET bias=%s, popularity=%s
                        WHERE source_id = %s;""", (info["bias"], info["popularity"], row[0]))

        row = cursor.fetchone()

    conn.commit()

    cursor.close()

def source_bias(source_name):
    query1 = '+'.join(source_name.split())
    search_url = 'https://mediabiasfactcheck.com/?s=' + query1
    
    search_response = requests.get(search_url)
    
    search_soup = bs4.BeautifulSoup(search_response.text, "html.parser")
    results_start = search_soup.find("h1", class_="page-title")
    first_result = results_start.next_sibling.next_sibling
    
    # Return if results not found
    if first_result.name != "article":
        return {"bias":0, "popularity":0}

    # Follow search link
    article_url = first_result.find("a")["href"]
    article_response = requests.get(article_url)
    article_soup = bs4.BeautifulSoup(article_response.text, "html.parser")
    
    # Get bias
    bias_tag = article_soup.find(string=["Bias Rating:","Bias Rating: ",u"Bias Rating:\u00A0"])
    if bias_tag is not None:
        bias_text = bias_tag.next_element
        if bias_text.strong is not None:
            bias_text = bias_text.strong.text
        elif bias_text.span is not None:
            bias_text = bias_text.span.text
        else:
             bias_text = "unbiased"
    else:
        bias_tag = article_soup.find(string=["Reasoning:","Reasoning: ",u"Reasoning:\u00A0"])
        if bias_tag is not None:
            bias_text = bias_tag.next_element
            if bias_text.strong is not None:
                bias_text = bias_text.strong.text.split(",")[0]
            elif bias_text.span is not None:
                bias_text = bias_text.span.text.split(",")[0]
            else:
                bias_text = "unbiased"
        else:
            bias_text = "unbiased"
    bias_text = bias_text.lower().strip().replace(u"\u00A0", " ")
    if bias_text in BIAS_TABLE:
        bias_num = BIAS_TABLE[bias_text]
    else:
        bias_num = 0

    # Get popularity
    pop_tag = article_soup.find(string=["Traffic/Popularity:","Traffic/Popularity: ",u"Traffic/Popularity:\u00A0"])
    if pop_tag is not None:
        pop_text = pop_tag.next_element.text
        pop_text = pop_text.lower().strip().replace(u"\u00A0", " ")
        if pop_text in POP_TABLE:
            pop = POP_TABLE[pop_text]
        else:
            pop = 0
    else:
        pop = 0
    
    return {"bias":bias_num, "popularity":pop}

main()