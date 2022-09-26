#!/bin/bash

SCRIPTS_DIR=`dirname "$0"`

cat "$SCRIPTS_DIR/../sql/schema.sql" \
    | psql -U eakulenko -d hyundai-rent -p 5432 -h localhost -1 -f -