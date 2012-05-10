# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table display (
  id                        bigint not null,
  name                      varchar(255),
  width                     integer,
  height                    integer,
  latitude                  float,
  longitude                 float,
  current_layout_id         bigint,
  constraint pk_display primary key (id))
;

create table display_layout (
  id                        bigint not null,
  name                      varchar(255),
  constraint pk_display_layout primary key (id))
;

create table tile (
  id                        bigint not null,
  app_name                  varchar(255),
  start_x                   varchar(255),
  start_y                   varchar(255),
  width                     varchar(255),
  height                    varchar(255),
  layout_id                 bigint,
  html_source               varchar(255),
  constraint pk_tile primary key (id))
;

create sequence display_seq;

create sequence display_layout_seq;

create sequence tile_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists display;

drop table if exists display_layout;

drop table if exists tile;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists display_seq;

drop sequence if exists display_layout_seq;

drop sequence if exists tile_seq;

