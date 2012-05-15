# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table display (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  width                     integer,
  height                    integer,
  latitude                  float,
  longitude                 float,
  current_layout_id         bigint,
  constraint pk_display primary key (id))
;

create table display_layout (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  constraint pk_display_layout primary key (id))
;

create table tile (
  id                        bigint auto_increment not null,
  app_name                  varchar(255),
  start_x                   varchar(255),
  start_y                   varchar(255),
  width                     varchar(255),
  height                    varchar(255),
  layout_id                 bigint,
  html_source               varchar(255),
  constraint pk_tile primary key (id))
;




# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table display;

drop table display_layout;

drop table tile;

SET FOREIGN_KEY_CHECKS=1;

