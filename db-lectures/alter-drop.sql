CREATE TABLE produtos(
    codigo SERIAL PRIMARY KEY,
    descricao VARCHAR(30) NOT NULL
);

ALTER -> Alterar uma tabela
-- ALTER TABLE tipos_produto ADD peso DECIMAL(8,2):

DROP -> Deletar uma tabela
-- DROP TABLE produtos;

Deletar todo o banco de dados
-- DROP DATABASE secao04;

Conceder privilegios para usuários
GRANT ALL ON empresas TO estagiario;

GRANT USAGE, SELECT on SEQUENCE empresas_id_seq TO estagiario;

Remover permissões de usuários
REVOKE ALL ON empresas FROM estagiario;



-- ----------------------------------------------------
-- Table 'nome do banco de dados'.'nome da tabela'
-- ----------------------------------------------------
