-- crear usuario de sql y darle privilegios mas acceso por ip o por cualquier maquina

CREATE USER 'rootone'@'%' IDENTIFIED BY 'tucontraseñña';
CREATE USER 'rootone'@'181.49.125.74' IDENTIFIED BY 'tucontraseñña';

GRANT ALL PRIVILEGES ON *.* TO 'rootone'@'%' IDENTIFIED BY 'tucontraseñña' WITH GRANT OPTION;