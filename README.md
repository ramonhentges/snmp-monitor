# snmp-monitor

Este sistema se propõem a monitorar equipamentos compatíveis com o protocolo SNMP versão 2c.

Para o iniciar, entre nas pastas frontend e backend e duplique os arquivos .env.example com o nome .env, então execute o comando 'docker-compose up'.

Na primeira vez, acesse o pgAdmin através do endereço localhost:5050 com o e-mail 'admin@admin.com' e a senha 'root', adicione um servidor com o endereço de host db, porta 5432, usuário postgres e senha root.

Após isso verá um banco de dados chamado snmp, nele, execute o arquivo script-bd.sql para criar as tabelas necessárias.

Com isto feito, acesse o sistema a partir do endereço http://localhost:3000/snmp, com o usuário 'admin' e a senha '123456'.
