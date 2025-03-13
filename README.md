# Portal do Aluno - Edunéxia

Portal do Aluno para a plataforma educacional Edunéxia, oferecendo uma experiência digital completa para os estudantes gerenciarem todos os aspectos de sua vida acadêmica.

## Funcionalidades

- **Dashboard Principal**: Visão geral personalizada com resumo de cursos, atividades e notificações
- **Área Acadêmica**: Gestão de cursos, materiais e avaliações
- **Rota de Aprendizagem**: Visualização intuitiva do progresso educacional
- **Certificados**: Emissão e gerenciamento de certificados digitais
- **Financeiro**: Acompanhamento de mensalidades e pagamentos

## Tecnologias

- Next.js 15.2.1 (App Router + RSC)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI + Radix UI

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar servidor de produção
npm start
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css
│   └── student/ (páginas do portal)
│       ├── dashboard/
│       ├── courses/
│       ├── learning-path/
│       ├── certificates/
│       ├── financial/
│       └── layout.tsx
└── components/
    └── student/ (componentes reutilizáveis)
        ├── course-card.tsx
        ├── mock-data.ts
        ├── routes.ts
        └── types.ts
```

## Licença

Propriedade da Edunéxia. Todos os direitos reservados.

## Storage Buckets

O projeto utiliza os seguintes buckets de armazenamento no Supabase:

- `Avatars` - Armazenamento de avatares de usuários (note o 'A' maiúsculo)
- `course-thumbnails` - Miniaturas de cursos
- `certificates` - Certificados gerados
- `receipts` - Recibos e comprovantes
- `profile-images` - Imagens de perfil
- `lesson-content` - Conteúdo de aulas
- `supplementary-materials` - Materiais complementares

Para acessar os buckets, utilize as funções em `src/utils/storage-utils.ts` e as constantes em `src/config/storage-buckets.ts`.
