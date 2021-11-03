# Split
Bipartisan News Viewer

In lieu of the divisive 2016 and 2020 US presidential elections, we decided to come up with a way to bridge the political gap, and to combat misinformation on the internet. Although there are many powerful fact-checking tools already available, not only are they computationally intensive, but going out of your way to check articles on their validity is tiresome and, to be frank, annoying.

Split aims to change all of that. Originally conceieved by Lenny Meng in SBUHacks 2020, Split aims to scrape news articles off the web and categorize them into a political spectrum of Democrat or Republican. To best understand those on either side of the poltical spectrum, Split will display articles on both sides of the page, to give everyone a peek into the other side.

# Tools and Technologies Used
For web scraping and categorization, we will use Python. For frontend, we are using Svelte. For the backend, we will use Express.JS. Everything will be powered by Node.JS. The application and database will be hosted on Google Cloud.

Contributors: <br />
Lenny Meng (lmeng1214@gmail.com) <br />
Evan Dunning (dunning0@purdue.edu) <br />
Huy Anh Bui (bui13@purdue.edu) <br />
John Crawford V (crawfo58@purdue.edu) <br />

---
# Developer Information

## Overall Structure
Google Cloud SQL <-IAM authentication via JSON key file-> Google Cloud SQL Proxy <-Knex PostgreSQL Package for Node.JS-> Express.JS Backend <-RESTful API Calls-> Svelte Frontend

## Runnable Scripts
- cloud\_sql\_proxy
- gcloud\_shell.sh
- run\_sql\_proxy.sh

### cloud\_sql\_proxy
Provided by Google. Don't worry about its nitty-gritty arguments; I've taken that pain away :')

### gcloud\_shell.sh
This is what you run when you want to treat the cloud SQL database as if it were local. It's the same feature as the Google Cloud "Cloud Shell", or if you were to run "sudo mysql" but for PostgreSQL (psql).

### run\_sql\_proxy.sh
This is what you run to abstract away all the cloud\_sql\_proxy arguments. Due to security vulnerability reasons, this file cannot be shared via GitHub, so you will have to create it yourself. This is what you put in it:

```
#!/bin/sh

clear

./cloud_sql_proxy -enable_iam_login -credential_file=<PATH_TO_JSON_KEY_FILE> -instances=split-327923:us-central1:split-pgsql=tcp:5432
```

To get the JSON key file, check the Discord. Store it in a folder called:

.../split-server/config/\<KEY\_FILE\>.JSON

**PLEASE MAKE SURE TO NOT PUSH THIS FILE, OR THE CREDENTIAL FILE TO GITHUB!**
**DO NOT CHANGE THE KEY FILE'S NAME OR FOLDER OR STORAGE DESTINATION FOR GITHUB REASONS!**

## Running the Backend
1. Make sure you have the Credential File. Check Discord to download it.
2. Make sure you have created your own 'run\_sql\_proxy.sh' file. **Follow the instructions carefully!!**
3. Run ```chmod +x``` on your newly created 'run\_sql\_proxy.sh' file so that it can execute.
4. Once the proxy is finished, you can use the npm commands as follows:

Always run ```npm run build```. For some reason, npm run dev doesn't pick up changes very fast.
If you want to deploy the backend, run ```npm run start``` after running ```npm run build```. You should see your backend deployed in Chrome!
