-- Fotos chegam como data URL (base64) e não cabem em VARCHAR(2000).
ALTER TABLE pedidos ALTER COLUMN foto_entulho TYPE TEXT;
ALTER TABLE pedidos ALTER COLUMN foto_descarga TYPE TEXT;

-- ---------------------------------------------------------------------------
-- DADOS DE DEMONSTRAÇÃO DO MVP
-- Locais fictícios para o teste; substituir pelos locais autorizados
-- informados pela Prefeitura de Lavras antes de uso real.
-- ---------------------------------------------------------------------------
INSERT INTO locais_descarte (nome, descricao, endereco, bairro, cidade, ativo) VALUES
    ('Ecoponto Centro (demonstração)',
     'Recebe entulho ensacado de pequenas reformas (até 1,5 m³ por entrega). Dado de demonstração do MVP.',
     'Rua de exemplo, 100', 'Centro', 'Lavras-MG', TRUE),
    ('Área de Triagem Norte (demonstração)',
     'Triagem e reciclagem de resíduos da construção civil classe A. Dado de demonstração do MVP.',
     'Avenida de exemplo, 2000', 'Jardim Glória', 'Lavras-MG', TRUE),
    ('Ecoponto Sul (demonstração)',
     'Ponto de entrega voluntária para pequenos volumes. Dado de demonstração do MVP.',
     'Rua de exemplo, 350', 'Água Limpa', 'Lavras-MG', TRUE);

-- Usuários de teste. Senha de ambos: ecoobra123
INSERT INTO usuarios (nome, email, senha, telefone, perfil) VALUES
    ('Morador Demo', 'morador@ecoobra.com', 'rtMSeFzdFyBIbOmm/g3b8KgfblCfhU2ADQH7rTokTHU=', '(35) 90000-0001', 'GERADOR'),
    ('Freteiro Demo', 'freteiro@ecoobra.com', 'rtMSeFzdFyBIbOmm/g3b8KgfblCfhU2ADQH7rTokTHU=', '(35) 90000-0002', 'FRETEIRO');

INSERT INTO perfis_freteiro (usuario_id, tipo_veiculo, modelo_veiculo, placa)
SELECT id, 'Picape', 'Fiat Strada', 'ABC1D23' FROM usuarios WHERE email = 'freteiro@ecoobra.com';
