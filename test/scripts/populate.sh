#!/bin/bash

mongoimport --jsonArray --drop --db $DB --collection apartments --file ../data/apartments.json
echo 'did apartments'
mongoimport --jsonArray --drop --db $DB --collection renters --file ../data/renters.json
echo 'did renters'
