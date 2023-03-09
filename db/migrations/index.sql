CREATE TABLE users(id int primary key, telegram_user_id int, telegram_username varchar(250));
CREATE SEQUENCE users_id_seq;
alter table users alter column id set default nextval('users_id_seq');
ALTER TABLE IF EXISTS users ADD COLUMN telegram_first_name varchar(250);
ALTER TABLE IF EXISTS users ADD COLUMN telegram_last_name varchar(250);
ALTER TABLE users ADD COLUMN verified boolean;
ALTER TABLE users ADD COLUMN login_token char(30);
ALTER TABLE users ADD COLUMN login_token_expire_at timestamptz;
CREATE TABLE telegram_updates(id bigint primary key);
alter table telegram_updates rename to processed_telegram_updates;
alter table processed_telegram_updates add column is_deferred boolean;
ALTER TABLE users RENAME COLUMN login_token_expire_at TO login_until;
ALTER TABLE users ADD COLUMN be_logged_in_until timestamptz;
ALTER TABLE users RENAME COLUMN telegram_username TO telegram_user_name;

-- if user has joined telegram already, then create user's entry manually by next command.
insert into users(telegram_user_id, telegram_user_name, telegram_first_name) values(165908109, 'iLhEV', 'iLhEV');


-- before 27/06/2022 - this migration file is actual and checked.

CREATE TABLE customers(id int primary key, price int, currency varchar(5));
alter table customers add column timeSlots json;
CREATE TABLE appointments(id int primary key, customer_id int, time timestamptz, duration smallint);
CREATE SEQUENCE customers_id_seq;
alter table customers alter column id set default nextval('customers_id_seq');
ALTER TABLE customers ADD COLUMN name varchar(100);

-- before 25/07/2022 - this migration file is actual and checked.

-- create table appointments
CREATE SEQUENCE time_slots_id_seq;
CREATE TABLE public.appointments (
    id integer DEFAULT nextval('public.time_slots_id_seq'::regclass) NOT NULL,
    customer_id integer NOT NULL,
    valid_from timestamp without time zone NOT NULL,
    valid_to timestamp without time zone,
    duration smallint NOT NULL,
    hour smallint NOT NULL,
    minute smallint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    type smallint NOT NULL,
    date date,
    week_day smallint,
    deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp without time zone
);
ALTER TABLE ONLY public.appointments ADD CONSTRAINT appointments_pk PRIMARY KEY (id);

-- create logs table
CREATE SEQUENCE log_id_seq;
CREATE TABLE public.logs (
    id integer DEFAULT nextval('public.log_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    object smallint NOT NULL,
    object_id integer NOT NULL,
    operation smallint NOT NULL,
    "values" json
);
ALTER TABLE ONLY public.logs ADD CONSTRAINT logs_pk PRIMARY KEY (id);

ALTER TABLE customers ADD COLUMN created_at timestamp;
ALTER TABLE customers ADD COLUMN updated_at timestamp;
ALTER TABLE customers ADD COLUMN deleted_at timestamp;
ALTER TABLE customers ADD COLUMN deleted boolean;

-- create table results
CREATE SEQUENCE appointments_results_id_seq;
CREATE TABLE appointments_results (
    id integer DEFAULT nextval('appointments_results_id_seq'::regclass) NOT NULL,
    appointment_id integer not null,
    date date,
    result smallint,
    price int,
    currency varchar(5),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone
);
ALTER TABLE appointments_results ADD CONSTRAINT appointments_results_pk PRIMARY KEY (id);