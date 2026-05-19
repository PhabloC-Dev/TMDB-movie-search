# TMDB Movie Search & Rating Engine

Um ecossistema completo para busca, catalogação e avaliação de filmes consumindo a API pública do The Movie Database (TMDB). O projeto conta com um backend em Python (Flask) integrado a uma camada de cache inteligente em memória, persistência de dados estruturados em PostgreSQL e um frontend reativo em React com TypeScript otimizado para filtros client-side instantâneos e estabilidade de layout.

## Começando

Estas instruções fornecerão uma cópia do projeto instalado e rodando em sua máquina local para fins de desenvolvimento e testes. Consulte a seção de implantação para obter notas sobre como implantar o projeto em um sistema de produção.

### Pré-requisitos

Requisitos para o software e outras ferramentas necessárias para construir, testar e enviar o projeto:

- **Docker Desktop** (v20.10+ recomendado)
- **Docker Compose** (v2.0+ recomendado)
- Uma chave de API ativa do **TMDB** (obtida gratuitamente no console de desenvolvedor do The Movie Database)

### Instalação

Um passo a passo de exemplos que ensinam como colocar o ambiente de desenvolvimento funcionando.

1. Clone o repositório para a sua máquina local:

```bash
git clone https://github.com/PhabloC-Dev/TMDB-movie-search.git
cd TMDB-movie-search
```

2. Configure as variáveis de ambiente necessárias para o ecossistema. Renomeie o arquivo chamado .envexample para .env e altera o arquivo, colocando a sua chave. É necessário dar um nome para o banco de dados, usuário e senha.

3. Inicialize e compile todos os containers do ecossistema de forma orquestrada com o Docker Compose:

docker compose up --build

4. Acesse a aplicação diretamente do seu navegador assim que a compilação terminar:

http://localhost:5173


5. Use a interface. Digite o nome de um filme, aplique filtros para facilitar a pesquisa e veja os resultados aparecem. 

6. Passando o mouse em cima da imagem, você consegue ver informações como nota média, data de lançamento, e título.
Clicando na imagem, você consegue, além das informações descritas acima, ver elenco, sinopse e dar sua própria nota para o filme.

7. Verifique a página de filmes avaliados, onde você pode revisar ou retirar a nota dada a um filme.