Rodovias BR 
==============

Um projeto de Carlos Chiconato, Fernando Witzke, Reinaldo Junior, Gabriel Albo e Glauber Ramos.

Os dados disponíveis podem ser encontrados em <http://dados.gov.br/dataset/acidentes-rodovias-federais>

### Como importar os dados
* `sh import.sh` importa todos os arquivos csv da pasta criando indexes e relaciomentos

### Como subir o servidor
`shotgun -p <PORT>`

### Instruções para entender e utilizar a aplicação

Rodovias BR é um aplicativo voltado a população brasileira, é possivel analisar e enteder os pontos e periodos críticos onde ocorrem mais acidentes.

A aplicação está divida da seguinte maneira:

* View 1 - página inicial onde é exibida a view com os dados relativos aos estados;
* View 2 - é exibida a view com os dados relativos as rodovias.
