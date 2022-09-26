DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;

SET search_path = public;

CREATE TABLE auto (
    id serial PRIMARY KEY,
    name varchar(100) UNIQUE NOT NULL
    number varchar(15) UNIQUE NOT NULL
);