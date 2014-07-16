#!/bin/sh

curl -X PUT http://localhost:5984/_config/admins/admin -d '"admin"'
