# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table display (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  latitude                  float,
  longitude                 float,
  constraint pk_display primary key (id))
;




# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table display;

SET FOREIGN_KEY_CHECKS=1;

