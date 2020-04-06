CREATE TABLE empregado (
	nome_emp	text,
	salario		integer,
	ultima_data	timestamp,
	ultimo_usuario text
);

DROP FUNCTION emp_gatilho();

CREATE FUNCTION emp_gatilho() RETURNS trigger AS $emp_gatilho$
	BEGIN
		-- Verificar se foi fornecido o nome o salário do empregado
		IF NEW.nome_emp IS NULL THEN -- NEW em insert e update
			RAISE EXCEPTION 'O nome do empregado não pode ser nulo';
		END IF;
		IF NEW.salario IS NULL THEN
			RAISE EXCEPTION '% não pode ter um salário nulo', NEW.nome_emp;
		END IF;
		
		-- Definir um salário válildo?
		IF NEW.salario < 0 THEN
			RAISE EXCEPTION '% não pode ter um salário negativo', NEW.nome_emp;
		END IF;
		
		-- Registrar quem alterou a folha de pagamento e quando
		NEW.ultima_data := 'now';
		NEW.ultimo_usuario := current_user;
		
		IF (TG_P = 'INSERT') THEN
			NEW.data_cria := current_timestamp;
			NEW.usu_cria := current_user;
		
		-- Registrar quem alterou a linha e quando
		ELSIF (TG_OP = 'UPDATE') THEN
			NEW.data_atu := current_timestamp;
			NEW.usu_atu := current_user;
		END IF;
		RETURN NEW;
	END;
$emp_gatilho$ LANGUAGE plpgsql;

CREATE TRIGGER emp_gatilho BEFORE INSERT OR UPDATE ON empregado
	FOR EACH ROW EXECUTE PROCEDURE emp_gatilho();
	
INSERT INTO empregado (nome_emp, salario) VALUES ('Ilson', 2000);
INSERT INTO empregado (nome_emp, salario) VALUES ('Daniela', 5000);
UPDATE empregado SET salario = 4500 WHERE nome_emp = 'Daniela';

SELECT * FROM empregado;

DROP TABLE empregado;

CREATE TABLE empregado (
	nome_emp	text,
	salario		integer,
	usu_cria	text,		-- Usuário que criou a linha
	data_cria	timestamp,	-- Data da criação da linha
	usu_atu		text,		-- Usuário que fez a atualização
	data_atu	timestamp,	-- Data da atualização
	ultima_data	timestamp,
	ultimo_usuario text
);





SELECT * FROM registros;

CREATE FUNCTION registra() RETURNS trigger AS $registra$
	BEGIN
		IF NEW.nome_emp IS NOT NULL THEN
			INSERT INTO registros (nome) VALUES (NEW.nome_emp);
		END IF;
	END;
$registra$ LANGUAGE plpgsql;

CREATE TRIGGER registra BEFORE INSERT OR UPDATE ON registros
	FOR EACH ROW EXECUTE PROCEDURE registra();

CREATE TABLE registros (
	nome	text
);








CREATE TABLE empregado (
	nome_emp	text NOT NULL,
	salario		integer
);

CREATE TABLE emp_audit (
	usuario text NOT NULL,
	
);

CREATE OR REPLACE 
	IF (TG_OP = 'DELETE') THEN
		INSERT INTO emp_audit SELECT 'D', user, now(), OLD.*;
		RETURN OLD;
	ELSIF (TG_OP = 'UPDATE') THEN
		INSERT INTO emp_audit SELECT 'U', user, now(), NEW.*;
		RETURN NEW;
	ELSIF (TG_OP = 'INSERT') THEN
		INSERT INTO emp_audit SELECT 'I', user, now(), NEW.*;
		RETURN NEW;
	END IF;
	RETURN NULL; -- o resultado é ignorado uma vez que este é um
$emp_audit$ language plpgsql;
	
CREATE TRIGGER emp_audit
AFTER INSERT OR UPDATE OR DELETE on empregado
	FOR EACH ROW EXECUTE PROCEDURE processa_emp_audit();
	
	
	
	
	

CREATE TABLE empregado (
	nome_emp	text NOT NULL,
	salario		integer
);

CREATE TABLE emp_audit (
	usuario text NOT NULL,
	data timestamp NOT NULL,
	id integer NOT NULL,
	coluna text NOT NULL,
	valor_antigo 
	valor_novo
);

CREATE OR REPLACE FUNCTION processa_emp_audit() RETURNS TRIGGER AS
	BEGIN
		IF (NEW.id <> OLD.id) THEN
			RAISE EXCEPTION 'Não pe permitido atualizar o campo ID';
		END IF;
		
		IF (NEW.nome_emp <> OLD.nome_emp) THEN
			INSERT INTO emp_audit SELECT current_user, current_timestamp
				NEW.id, 'nome_emp', OLD.nome_emp, NEW.nome_emp;
		END IF;
		
		IF (NEW.salario <> OLD.salario) THEN
			INSERT INTO emp_audit SELECT current_user,
