
CREATE SEQUENCE public.email_id_email_seq;

CREATE TABLE public.email (
                id_email INTEGER NOT NULL DEFAULT nextval('public.email_id_email_seq'),
                descricao VARCHAR NOT NULL,
                email_origem VARCHAR NOT NULL,
                email_destino VARCHAR NOT NULL,
                host_smtp VARCHAR NOT NULL,
                porta_smtp INTEGER NOT NULL,
                criptografia BOOLEAN NOT NULL,
                usuario VARCHAR NOT NULL,
                senha VARCHAR NOT NULL,
                CONSTRAINT id_email PRIMARY KEY (id_email)
);


ALTER SEQUENCE public.email_id_email_seq OWNED BY public.email.id_email;

CREATE SEQUENCE public.usuario_id_usuario_seq;

CREATE TABLE public.usuario (
                id_usuario INTEGER NOT NULL DEFAULT nextval('public.usuario_id_usuario_seq'),
                nome_completo VARCHAR NOT NULL,
                usuario VARCHAR NOT NULL,
                senha VARCHAR NOT NULL,
                CONSTRAINT id_usuario PRIMARY KEY (id_usuario)
);


ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;

CREATE SEQUENCE public.severidade_id_severidade_seq_1;

CREATE TABLE public.severidade (
                id_severidade INTEGER NOT NULL DEFAULT nextval('public.severidade_id_severidade_seq_1'),
                descricao VARCHAR NOT NULL,
                CONSTRAINT id_severidade PRIMARY KEY (id_severidade)
);


ALTER SEQUENCE public.severidade_id_severidade_seq_1 OWNED BY public.severidade.id_severidade;

CREATE SEQUENCE public.template_id_template_seq;

CREATE TABLE public.template (
                id_template INTEGER NOT NULL DEFAULT nextval('public.template_id_template_seq'),
                descricao VARCHAR NOT NULL,
                CONSTRAINT id_template PRIMARY KEY (id_template)
);


ALTER SEQUENCE public.template_id_template_seq OWNED BY public.template.id_template;

CREATE SEQUENCE public.sensor_id_sensor_seq;

CREATE TABLE public.sensor (
                id_sensor INTEGER NOT NULL DEFAULT nextval('public.sensor_id_sensor_seq'),
                descricao VARCHAR NOT NULL,
                oid VARCHAR NOT NULL,
                ativo BOOLEAN NOT NULL,
                intervalo INTEGER NOT NULL,
                id_template INTEGER NOT NULL,
                tipo VARCHAR NOT NULL,
                CONSTRAINT id_sensor PRIMARY KEY (id_sensor)
);


ALTER SEQUENCE public.sensor_id_sensor_seq OWNED BY public.sensor.id_sensor;

CREATE SEQUENCE public.trigger_id_trigger_seq;

CREATE TABLE public.trigger (
                id_trigger INTEGER NOT NULL DEFAULT nextval('public.trigger_id_trigger_seq'),
                descricao VARCHAR NOT NULL,
                id_sensor INTEGER NOT NULL,
                id_severidade INTEGER NOT NULL,
                ativo BOOLEAN NOT NULL,
                enviar_email BOOLEAN NOT NULL,
                valor_comparado VARCHAR NOT NULL,
                comparacao VARCHAR NOT NULL,
                CONSTRAINT id_trigger PRIMARY KEY (id_trigger)
);


ALTER SEQUENCE public.trigger_id_trigger_seq OWNED BY public.trigger.id_trigger;

CREATE SEQUENCE public.grupo_id_grupo_seq;

CREATE TABLE public.grupo (
                id_grupo INTEGER NOT NULL DEFAULT nextval('public.grupo_id_grupo_seq'),
                descricao VARCHAR NOT NULL,
                CONSTRAINT id_grupo PRIMARY KEY (id_grupo)
);


ALTER SEQUENCE public.grupo_id_grupo_seq OWNED BY public.grupo.id_grupo;

CREATE SEQUENCE public.host_id_host_seq;

CREATE TABLE public.host (
                id_host INTEGER NOT NULL DEFAULT nextval('public.host_id_host_seq'),
                nome VARCHAR NOT NULL,
                ip VARCHAR NOT NULL,
                porta INTEGER NOT NULL,
                comunidade VARCHAR NOT NULL,
                CONSTRAINT id_host PRIMARY KEY (id_host)
);


ALTER SEQUENCE public.host_id_host_seq OWNED BY public.host.id_host;

CREATE SEQUENCE public.dados_sensor_host_id_dados_sensor_host_seq;

CREATE TABLE public.dados_sensor_host (
                id_dados_sensor_host INTEGER NOT NULL DEFAULT nextval('public.dados_sensor_host_id_dados_sensor_host_seq'),
                id_host INTEGER NOT NULL,
                id_sensor INTEGER NOT NULL,
                valor VARCHAR NOT NULL,
                data_hora TIMESTAMP NOT NULL,
                CONSTRAINT id_dados_sensor_host PRIMARY KEY (id_dados_sensor_host)
);


ALTER SEQUENCE public.dados_sensor_host_id_dados_sensor_host_seq OWNED BY public.dados_sensor_host.id_dados_sensor_host;

CREATE SEQUENCE public.problemas_id_problemas_seq;

CREATE TABLE public.problemas (
                id_problemas INTEGER NOT NULL DEFAULT nextval('public.problemas_id_problemas_seq'),
                id_trigger INTEGER NOT NULL,
                id_dados_sensor_host INTEGER NOT NULL,
                data_hora_inicial TIMESTAMP NOT NULL,
                data_hora_final TIMESTAMP,
                CONSTRAINT id_problemas PRIMARY KEY (id_problemas)
);


ALTER SEQUENCE public.problemas_id_problemas_seq OWNED BY public.problemas.id_problemas;

CREATE TABLE public.template_host (
                id_host INTEGER NOT NULL,
                id_template INTEGER NOT NULL,
                CONSTRAINT id_template_host PRIMARY KEY (id_host, id_template)
);


CREATE TABLE public.grupo_host (
                id_grupo INTEGER NOT NULL,
                id_host INTEGER NOT NULL,
                CONSTRAINT id_grupo_host PRIMARY KEY (id_grupo, id_host)
);


ALTER TABLE public.trigger ADD CONSTRAINT severidade_trigger_fk
FOREIGN KEY (id_severidade)
REFERENCES public.severidade (id_severidade)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.template_host ADD CONSTRAINT template_template_host_fk
FOREIGN KEY (id_template)
REFERENCES public.template (id_template)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.sensor ADD CONSTRAINT template_sensor_fk
FOREIGN KEY (id_template)
REFERENCES public.template (id_template)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.dados_sensor_host ADD CONSTRAINT sensor_dados_sensor_host_fk
FOREIGN KEY (id_sensor)
REFERENCES public.sensor (id_sensor)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.trigger ADD CONSTRAINT sensor_trigger_fk
FOREIGN KEY (id_sensor)
REFERENCES public.sensor (id_sensor)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.problemas ADD CONSTRAINT trigger_problemas_fk
FOREIGN KEY (id_trigger)
REFERENCES public.trigger (id_trigger)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.grupo_host ADD CONSTRAINT grupo_grupo_host_fk
FOREIGN KEY (id_grupo)
REFERENCES public.grupo (id_grupo)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.grupo_host ADD CONSTRAINT host_grupo_host_fk
FOREIGN KEY (id_host)
REFERENCES public.host (id_host)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.template_host ADD CONSTRAINT host_template_host_fk
FOREIGN KEY (id_host)
REFERENCES public.host (id_host)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.dados_sensor_host ADD CONSTRAINT host_dados_sensor_host_fk
FOREIGN KEY (id_host)
REFERENCES public.host (id_host)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.problemas ADD CONSTRAINT dados_sensor_host_problemas_fk
FOREIGN KEY (id_dados_sensor_host)
REFERENCES public.dados_sensor_host (id_dados_sensor_host)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

CREATE SEQUENCE public.indisponibilidade_id_indisponibilidade_seq;

CREATE TABLE public.indisponibilidade (
                id_indisponibilidade INTEGER NOT NULL DEFAULT nextval('public.indisponibilidade_id_indisponibilidade_seq'),
                id_host INTEGER NOT NULL,
                data_hora_inicial TIMESTAMP NOT NULL,
                data_hora_final TIMESTAMP,
                CONSTRAINT id_indisponibilidade PRIMARY KEY (id_indisponibilidade)
);


ALTER SEQUENCE public.indisponibilidade_id_indisponibilidade_seq OWNED BY public.indisponibilidade.id_indisponibilidade;

ALTER TABLE public.indisponibilidade ADD CONSTRAINT host_indisponibilidade_fk
FOREIGN KEY (id_host)
REFERENCES public.host (id_host)
ON DELETE CASCADE
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE public.host
ADD COLUMN email_indisponibilidade boolean NOT NULL
DEFAULT false;

ALTER TABLE public.sensor
ADD COLUMN expressao VARCHAR NULL;

ALTER TABLE public.sensor
ADD COLUMN dias_armazenado INTEGER NOT NULL;

INSERT INTO email (descricao, email_origem, email_destino, host_smtp, porta_smtp, criptografia, usuario, senha) VALUES ('desc', 'teste@teste.com', 'teste@teste.com', 'teste.com', 587, true, 'usuario', 'senha');
INSERT INTO severidade (descricao) VALUES ('Aviso');
INSERT INTO severidade (descricao) VALUES ('Problema');
INSERT INTO usuario (nome_completo, usuario, senha) VALUES ('admin', 'admin', 'e10adc3949ba59abbe56e057f20f883e');