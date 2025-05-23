create table areas (
   code           integer not null,
   name           varchar(20) not null,
   faculty_code   integer not null,
   coordinator_id varchar(15) not null
);

create unique index areas__idx on
   areas (
      coordinator_id
   asc );

alter table areas add constraint areas_pk primary key ( code );

create table subjects (
   code         varchar(10) not null,
   name         varchar(30) not null,
   program_code integer not null
);

alter table subjects add constraint subjects_pk primary key ( code );

create table cities (
   code      integer not null,
   name      varchar(20) not null,
   dept_code integer not null
);

alter table cities add constraint cities_pk primary key ( code );

create table departments (
   code         integer not null,
   name         varchar(20) not null,
   country_code integer not null
);

alter table departments add constraint departments_pk primary key ( code );

create table employees (
   id               varchar(15) not null,
   first_name       varchar(30) not null,
   last_name        varchar(30) not null,
   email            varchar(30) not null,
   contract_type    varchar(30) not null,
   employee_type    varchar(30) not null,
   faculty_code     integer not null,
   campus_code      integer not null,
   birth_place_code integer not null
);

alter table employees add constraint employees_pk primary key ( id );

create table faculties (
   code         integer not null,
   name         varchar(30) not null,
   location     varchar(15) not null,
   phone_number varchar(15) not null,
   dean_id      varchar(15)
);

create unique index faculties__idx on
   faculties (
      dean_id
   asc );

alter table faculties add constraint faculties_pk primary key ( code );

create table groups (
   number       integer not null,
   semester     varchar(6) not null,
   subject_code varchar(10) not null,
   professor_id varchar(15) not null
);

alter table groups
   add constraint groups_pk primary key ( number,
                                          subject_code,
                                          semester );

create table countries (
   code integer not null,
   name varchar(30) not null
);

alter table countries add constraint countries_pk primary key ( code );

create table programs (
   code      integer not null,
   name      varchar(40) not null,
   area_code integer not null
);

alter table programs add constraint programs_pk primary key ( code );

create table campuses (
   code      integer not null,
   name      varchar(30),
   city_code integer not null
);

alter table campuses add constraint campuses_pk primary key ( code );

create table contract_types (
   name varchar(30) not null
);

alter table contract_types add constraint contract_types_pk primary key ( name );

create table employee_types (
   name varchar(30) not null
);

alter table employee_types add constraint employee_types_pk primary key ( name );

alter table areas
   add constraint areas_employees_fk foreign key ( coordinator_id )
      references employees ( id );
alter table areas
   add constraint areas_faculties_fk foreign key ( faculty_code )
      references faculties ( code );

alter table subjects
   add constraint subjects_programs_fk foreign key ( program_code )
      references programs ( code );

alter table cities
   add constraint cities_departments_fk foreign key ( dept_code )
      references departments ( code );

alter table departments
   add constraint departments_countries_fk foreign key ( country_code )
      references countries ( code );

alter table employees
   add constraint employees_contract_types_fk foreign key ( contract_type )
      references contract_types ( name );
alter table employees
   add constraint employees_cities_fk foreign key ( birth_place_code )
      references cities ( code );
alter table employees
   add constraint employees_faculties_fk foreign key ( faculty_code )
      references faculties ( code );
alter table employees
   add constraint employees_campuses_fk foreign key ( campus_code )
      references campuses ( code );
alter table employees
   add constraint employees_employee_types_fk foreign key ( employee_type )
      references employee_types ( name );

alter table faculties
   add constraint faculties_employees_fk foreign key ( dean_id )
      references employees ( id );

alter table groups
   add constraint groups_subjects_fk foreign key ( subject_code )
      references subjects ( code );
alter table groups
   add constraint groups_employees_fk foreign key ( professor_id )
      references employees ( id );

alter table programs
   add constraint programs_areas_fk foreign key ( area_code )
      references areas ( code );

alter table campuses
   add constraint campuses_cities_fk foreign key ( city_code )
      references cities ( code );