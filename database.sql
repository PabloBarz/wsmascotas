CREATE DATABASE dbmascotas;

USE dbmascotas;

CREATE TABLE mascotas
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('Perro', 'Gato') NOT NULL,
  nombre VARCHAR(35) NOT NULL,
  color VARCHAR(30) NOT NULL,
  pesokg DECIMAL(5,2) NOT NULL COMMENT'999.99'
)ENGINE = INNODB;

INSERT INTO mascotas (tipo, nombre, color, pesokg) VALUES
  ('Perro', 'Firulais', 'blanco', 7),
  ('Gato', 'Mencho', 'negro', 3.2);

SELECT * FROM mascotas;

-- DELETE FROM mascotas;

-- ALTER TABLE mascotas AUTO_INCREMENT 1;