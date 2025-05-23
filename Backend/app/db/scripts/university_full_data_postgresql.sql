-- 1) Countries
insert into countries (
   code,
   name
) values ( 1,
           'Colombia' );

-- 2) Departments
insert into departments (
   code,
   name,
   country_code
) values ( 1,
           'Valle del Cauca',
           1 ),( 2,
                 'Cundinamarca',
                 1 ),( 5,
                       'Antioquia',
                       1 ),( 8,
                             'Atlántico',
                             1 ),( 11,
                                   'Bogotá D.C.',
                                   1 );

-- 3) Cities
insert into cities (
   code,
   name,
   dept_code
) values ( 101,
           'Cali',
           1 ),( 102,
                 'Bogotá',
                 11 ),( 103,
                        'Medellín',
                        5 ),( 104,
                              'Barranquilla',
                              8 ),( 105,
                                    'Soledad',
                                    8 );

-- 4) Campuses
insert into campuses (
   code,
   name,
   city_code
) values ( 1,
           'Campus Cali',
           101 ),( 2,
                   'Campus Bogotá',
                   102 ),( 3,
                           'Campus Medellín',
                           103 ),( 4,
                                   'Campus Barranquilla',
                                   104 );

-- 5) Employee & Contract Types
insert into employee_types ( name ) values ( 'Docente' ),( 'Administrativo' );
insert into contract_types ( name ) values ( 'Planta' ),( 'Cátedra' );

-- 6) Faculties **sin** dean_id para no chocar
insert into faculties (
   code,
   name,
   location,
   phone_number
) values ( 1,
           'Facultad de Ciencias Sociales',
           'Cali',
           '555-1234' ),( 2,
                          'Facultad de Ingeniería',
                          'Cali',
                          '555-5678' );

-- 7) Employees
insert into employees (
   id,
   first_name,
   last_name,
   email,
   contract_type,
   employee_type,
   faculty_code,
   campus_code,
   birth_place_code
) values ( '1001',
           'Juan',
           'Pérez',
           'juan.perez@univcali.edu.co',
           'Planta',
           'Docente',
           1,
           1,
           101 ),( '1002',
                   'María',
                   'Gómez',
                   'maria.gomez@univcali.edu.co',
                   'Planta',
                   'Administrativo',
                   1,
                   2,
                   102 ),( '1003',
                           'Carlos',
                           'López',
                           'carlos.lopez@univcali.edu.co',
                           'Cátedra',
                           'Docente',
                           2,
                           1,
                           103 ),( '1004',
                                   'Carlos',
                                   'Mejía',
                                   'carlos.mejia@univcali.edu.co',
                                   'Planta',
                                   'Docente',
                                   1,
                                   3,
                                   103 ),( '1005',
                                           'Sandra',
                                           'Ortiz',
                                           'sandra.ortiz@univcali.edu.co',
                                           'Cátedra',
                                           'Docente',
                                           2,
                                           4,
                                           104 ),( '1006',
                                                   'Julián',
                                                   'Reyes',
                                                   'julian.reyes@univcali.edu.co',
                                                   'Planta',
                                                   'Administrativo',
                                                   2,
                                                   1,
                                                   105 );

-- 8) Ahora sí asigno dean_id en faculties
update faculties
   set
   dean_id = '1001'
 where code = 1;
update faculties
   set
   dean_id = '1002'
 where code = 2;

-- 9) Areas
insert into areas (
   code,
   name,
   faculty_code,
   coordinator_id
) values ( 1,
           'Área de Ciencias Sociales',
           1,
           '1001' ),( 2,
                      'Área de Ingeniería',
                      2,
                      '1003' );

-- 10) Programs
insert into programs (
   code,
   name,
   area_code
) values ( 1,
           'Psicología',
           1 ),( 2,
                 'Ingeniería de Sistemas',
                 2 );

-- 11) Subjects
insert into subjects (
   code,
   name,
   program_code
) values ( 'S101',
           'Psicología General',
           1 ),( 'S102',
                 'Cálculo I',
                 2 ),( 'S103',
                       'Programación',
                       2 ),( 'S104',
                             'Estructuras de Datos',
                             2 ),( 'S105',
                                   'Bases de Datos',
                                   2 ),( 'S106',
                                         'Redes de Computadores',
                                         2 ),( 'S107',
                                               'Sistemas Operativos',
                                               2 ),( 'S108',
                                                     'Algoritmos Avanzados',
                                                     2 );

-- 12) Groups
insert into groups (
   number,
   semester,
   subject_code,
   professor_id
) values ( 1,
           '2023-2',
           'S101',
           '1001' ),( 2,
                      '2023-2',
                      'S102',
                      '1003' ),( 3,
                                 '2023-2',
                                 'S103',
                                 '1004' );