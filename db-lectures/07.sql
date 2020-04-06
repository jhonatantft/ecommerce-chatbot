-- INSERTS

-- Tipos Produto
-- INSERT INTO tipos_produto (descricao) VALUES ('Computadores');
-- INSERT INTO tipos_produto (descricao) VALUES ('Impressoras');
-- INSERT INTO tipos_produto (descricao) VALUES ('Diversos');

-- Produtos
-- INSERT INTO produtos (descricao, preco, id_tipo_produto) VALUES ('Notebook DELL 1544', 1345.67, 1);
-- INSERT INTO produtos (descricao, preco, id_tipo_produto) VALUES ('Impr. Jato de tinta', 4235.67, 2);
-- INSERT INTO produtos (descricao, preco, id_tipo_produto) VALUES ('Mouse sem fio', 56, 3);

-- Pacientes
INSERT INTO pacientes (nome, endereco, bairo, cidade, estado, cep, data_nascimento)
	VALUES ('Angelina Jolie', 'Rua da paz, 44', 'Nova Lima', 'Santos', 'SP', '123456789', '1235-12-23');

-- Selects
SELECT * FROM pacientes;
