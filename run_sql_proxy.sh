#!/bin/sh

clear

./cloud_sql_proxy -enable_iam_login -credential_file=/home/lmeng1214/gdrive/Purdue/"Junior F21"/"CS 348"/Project/split-server/config/split-327923-17335aee126e.json -instances=split-327923:us-central1:split-pgsql=tcp:5432
