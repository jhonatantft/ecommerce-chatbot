-- BEGIN

-- END;
-- $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION soma(num1 integer, num2 integer)
RETURNS text AS $$
BEGIN
	RETURN 'O resultado é: ' || num1 + num2;
END;
$$ LANGUAGE plpgsql;

SELECT soma(10, 15);

DROP FUNCTION soma(integer, integer);

SELECT * FROM academico

SELECT
 	nome,
	disciplina,
	cod,
	telefone,
	soma(50, 10),
	acad_role(acad_pay)
 	FROM academico;
	
INSERT INTO academico (
	nome
)
VALUES ('Daniela')
	
ALTER TABLE academico ADD COLUMN acad_pay double precision;

CREATE FUNCTION acad_role (acad_pay double precision)
RETURNS text AS $$
BEGIN
	IF acad_pay < 4000 THEN
		RETURN 'Estagiário';
	ELSEIF acad_pay < 7000 THEN
		RETURN 'Desenvolvedor Júnior';
	ELSE
		RETURN 'Desenvolvedor Senior';
	END IF;
END;
$$ LANGUAGE plpgsql;

SELECT acad_role(9000)

-- CREATE TABLE academico(
-- 	id serial PRIMARY KEY,
-- 	nome VARCHAR (50),
-- 	disciplina VARCHAR (50),
-- 	cod VARCHAR (50),
-- 	telefone VARCHAR (355)
-- )

-- 1 - Faça uma função que divida dois valores
CREATE FUNCTION dividir (num1 integer, num2 integer)
RETURNS text AS $$
BEGIN
	RETURN num1 / num2;
END;
$$ LANGUAGE plpgsql;

SELECT dividir (100, 2)

-- 2 - Crie uma função

ALTER TABLE academico ADD COLUMN resultado TEXT;

CREATE FUNCTION mesclar_campos(nome TEXT, academico TEXT)
RETURNS text AS $$
DECLARE
	t2_linha academico%ROWTYPE;
BEGIN
	SELECT * INTO t2_linha FROM academico;
	return t_linha.f1 || t2_linha.f3 || t_linha.f5 || t2_linha.f7;
END;
$$ LANGUAGE plpgsql;

SELECT mesclar_campos(t.*) FROM academico t;

SELECT nome FROM academico;






