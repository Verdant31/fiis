
# Projeto de Análise de Investimentos

![image](https://github.com/user-attachments/assets/ced4d109-4c8f-4686-9cbf-efa8457db77d)

Esse projeto tem como objetivo facilitar o acompanhamento de fundos imobiliários (FIIs) e investimentos de renda fixa, proporcionando uma experiência completa para o investidor, com suporte a gráficos interativos, geração de relatórios em PDF e notícias atualizadas do mercado financeiro.

## Funcionalidades

### 🚀 Novidades e Melhorias
O projeto foi reconstruído para solucionar limitações anteriores e trazer novas funcionalidades:
- **Acesso Simples**: Agora com sistema de gerenciamento de usuários, eliminando a necessidade de rodar localmente.
- **API do Yahoo Finance**: Os dados são coletados pela API do Yahoo Finance, e dados faltantes são complementados com relatórios mensais da CVM.
- **Gráfico Interativos com IA**: Realize consultas intuitivas por linguagem natural, como “Mostre meus dividendos do XPML11.SA dos últimos 3 meses”.
- **Seção de Notícias**: Notícias financeiras em tempo real com dados da API do Yahoo Finance.
- **Suporte a Renda Fixa**: Agora, com suporte para fundos de investimento de renda fixa, com cálculos baseados nos índices CDI e IPCA.
- **Geração de PDFs**: Extraia PDFs personalizados de FIIs ou investimentos de renda fixa filtrados por período ou desde o início do investimento.

### 🔥 Recursos Adicionais
Além das principais melhorias, o projeto também oferece:
- **Visualizações aprimoradas**: Gráficos da biblioteca Shadcn para uma experiência mais rica e visual.
- **Indicação de Dados Defasados**: Dados coletados da CVM são exibidos com um aviso sobre a defasagem, caso a atualização não seja diária.
- **Versão Mobile**: Otimizado para dispositivos móveis, permitindo uma experiência responsiva.

## Instalação e Configuração

### Pré-requisitos
- Node.js (v14 ou superior)
- Yarn ou npm

### Passo a Passo
1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   cd nome-do-repositorio
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
     ```env
     DATABASE_URL=url de conexão 
     NEXT_PUBLIC_APP_URL="http://localhost:3000"
     NODE_ENV="dev"
     INFLATION_API_URL=""
     CDB_API_URL=""
     ```
4. Execute o projeto:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## Uso

1. **Login e Gerenciamento de Usuários**: Registre-se e faça login para acessar todos os recursos.
2. **Acessar Gráficos e Consultas de Investimentos**: Utilize a área de gráficos para acessar consultas predefinidas ou use a funcionalidade interativa de IA para consultas personalizadas.
3. **Exportação de PDF**: Vá até a seção de extratos e selecione o segmento (FIIs ou renda fixa) e o período desejado para gerar seu PDF.

## Tecnologias Utilizadas

- **React** e **Next.js**
- **TypeScript**
- **Shadcn** para gráficos
- **Yahoo Finance API** para dados de mercado
- **CVM API** para complementar dados faltantes

## Contribuindo

1. Fork este repositório
2. Crie uma branch com uma nova feature (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
