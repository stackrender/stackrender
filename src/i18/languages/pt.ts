import { Language } from "../types";

export const pt = {
  translation: {
    sidebar: {
      tables: "Tabelas",
      relationships: "Relacionamentos"
    },

    color_picker: {
      default_color: "Cor padrão"
    },
    navbar: {
      rename_db: "Renomear banco de dados",
      search: "Pesquisar"
    },
    db_controller: {
      filter: "Filtrar",
      add_table: "Adicionar Tabela",
      add_field: "Adicionar Campo",
      add_index: "Adicionar Índice",
      delete_table: "Excluir Tabela",
      duplicate: "Duplicar",
      add_relationship: "Adicionar Relacionamento",
      show_code: "Mostrar código",
      fields: "Campos",
      indexes: "Índices",
      note: "Nota",
      name: "Nome",
      type: "Tipo",
      nullable: "Aceita Nulo",
      select_fields: "Selecionar campos",
      unique: "Único",
      table_note: "Nota da tabela",
      collapse: "Recolher Tudo",
      primary_key: "Chave Primária",
      foreign_key: "Chave Estrangeira",

      source_table: "Tabela de Origem",
      referenced_table: "Tabela Referenciada",

      select_table: "Selecionar tabela",
      select_field: "Selecionar campo",

      empty_list: {
        no_tables: "Nenhuma Tabela",
        no_tables_description: "Crie uma tabela para começar.",
        no_relationships: "Nenhum Relacionamento",
        no_relationships_description: "Crie relacionamentos para conectar duas tabelas"
      },

      cardinality: {
        name: "Cardinalidade",
        one_to_one: "Um para Um",
        one_to_many: "Um para Muitos",
        many_to_one: "Muitos para Um",
        many_to_many: "Muitos para Muitos"
      },
      foreign_key_actions: {
        title: "Ações da Chave Estrangeira",
        on_delete: "Ao Excluir",
        on_update: "Ao Atualizar",
        actions: {
          no_action: "Nenhuma Ação",
          cascade: "Cascata",
          set_null: "Definir como Nulo",
          set_default: "Definir como Padrão",
          restrict: "Restringir"
        }
      },
      field_settings: {
        title: "Configuração de Campo",
        unique: "Único",
        unsigned: "Sem Sinal",
        numeric_setting: "Configuração Numérica",
        decimal_setting: "Configuração Decimal",
        zeroFill: "Preencher com Zeros",
        autoIncrement: "Auto Incremento",
        note: "Nota",

        delete_field: "Excluir Campo",
        field_note: "Nota do Campo",
        precision: "Precisão",
        text_setting: "Configuração de Texto",
        charset: "Charset",
        collation: "Colação",
        scale: "Escala",
        max_length: "Comprimento Máximo",
        integer_width: "Largura do Inteiro",
        width: "Largura",
        default_value: "Valor Padrão",
        value: "Valor",
        length: "Comprimento",
        values: "Valores",
        type_enter: "Digite e pressione enter",
        precision_def: "Dígitos totais permitidos (antes + depois do decimal).",
        scale_def: "Dígitos permitidos após o decimal.",
        time_default_value: {
          no_value: "Sem valor",
          custom: "Hora personalizada",
          now: "Agora"
        },
        errors: {
          max_length: "deve ser um número positivo, sem decimais.",
          integer_default_value: "Valor padrão inválido para Inteiro",
          precision: "Precisão deve ser um número positivo, sem decimais.",
          scale: "Escala deve ser um número positivo, sem decimais.",
          scale_max_value: "A escala deve ser ≤ à precisão."
        },
        pick_value: "Escolher valor"
      },
      delete: "Excluir",

      index_setting: "Configuração de Índice",
      table_actions: "Ações da Tabela",
      actions: "Ações",
      delete_index: "Excluir Índice",
      index_name: "Nome do Índice",
      create_relationship: "Criar Relacionamento",
      relationship_error: "Para criar um relacionamento, a chave primária e a chave estrangeira devem ser do mesmo tipo.",

      invalid_relationship: {
        title: "Relacionamento Inválido",
        description: "O tipo da chave de origem não corresponde ao tipo da chave referenciada. Verifique se ambos têm o mesmo tipo de dado."
      },
      circular_dependency: {
        title: "Dependência Circular Detectada",
        toast_description: "Foi encontrado um ciclo entre tabelas. Verifique o diagrama à esquerda e remova um dos relacionamentos para corrigir.",
        description: "Seu esquema contém uma relação circular de chave estrangeira entre tabelas. Para corrigir,",
        suggestion: "remova um dos relacionamentos listados abaixo que está causando o ciclo.",
        remove_relationship: "Remover relacionamento"
      }
    },
    table: {
      double_click: "Clique duas vezes para editar",
      overlapping_tables: "Tabelas Sobrepostas",
      show_more: "Mostrar mais",
      show_less: "Mostrar menos"
    },
    control_buttons: {
      redo: "Refazer",
      undo: "Desfazer",
      zoom_in: "Aumentar Zoom",
      zoom_out: "Diminuir Zoom",
      adjust_positions: "Ajustar Posições",
      show_all: "Mostrar tudo"
    },
    menu: {
      file: "Arquivo",
      new: "Novo",
      open: "Abrir",
      save: "Salvar",
      import: "Importar",
      json: ".json",
      dbml: ".dbml",
      mysql: "MySQL",
      postgresql: "PostgreSQL",
      export_sql: "Exportar SQL",
      generic: "Genérico",
      export_orm_models: "Exportar Modelos ORM",
      delete_project: "Excluir Projeto",
      edit: "Editar",
      undo: "Desfazer",
      redo: "Refazer",
      clear: "Limpar",
      view: "Visualizar",
      hide_controller: "Ocultar Controlador",
      show_controller: "Mostrar Controlador",
      cardinality_style: "Estilo de Cardinalidade",
      hidden: "Oculto",
      numeric: "Numérico",
      symbolic: "Simbólico",
      theme: "Tema",
      light: "Claro",
      dark: "Escuro",
      help: "Ajuda",
      show_docs: "Mostrar Documentação",
      join_discord: "Entrar no Discord"
    },

    modals: {
      close: "Fechar",
      create: "Criar",
      pick_database: "Escolha seu Banco de Dados.",
      create_database_header: "Cada banco de dados oferece recursos e funcionalidades distintas.",
      db_name: "Nome do Banco de Dados",
      db_name_error: "Por favor, forneça um nome para o Banco de Dados",
      continue: "Continuar",
      open: "Abrir",
      open_database: "Abrir Banco de Dados",
      open_database_header: "Abra um banco de dados selecionando um da lista.",
      delete_database: "Excluir Banco de Dados",
      delete_database_content: "Esta ação é irreversível e removerá o diagrama permanentemente.",
      delete: "Excluir",

      import_database: {
        title: "Importar seu Banco de Dados",
        import: "Importar",
        import_options: "Gostaria de importar usando:",
        import_error: "Erro de Análise SQL",
        import_error_description: "Não foi possível importar seu SQL porque contém sintaxe inválida.",
        import_warning: "Aviso de Análise SQL",
        import_warning_description: "Alguns elementos não puderam ser processados devido a declarações não suportadas ou incompletas."
      },
      export_sql: "Exportar SQL",
      export_sql_header: "Exporte seu diagrama de banco de dados em código SQL"
    },
    clipboard: {
      copy: "Copiar",
      copied: "Copiado"
    },

    connection_status: {
      online: "Online",
      offline: "Offline",
      saving: "Salvando",
      saved: "Salvo",
      last_synced: "Última sincronização",
      min_ago: "min atrás",
      hour_ago: "hora atrás",
      just_now: "Agora mesmo"
    },
    import: {
      instructions: "Instruções",
      install: "Instalar",
      run_command: "Execute o seguinte comando no seu terminal.",
      example: "Exemplo",
      copy_code: "Copie o conteúdo do arquivo .sql na seção de código abaixo.",
      pg_admin: {
        step1: "Abra o <bold>Pg Admin</bold>.",
        step2: "Clique com o botão direito no seu banco de dados e selecione <bold>Backup</bold>.",
        step3: "Dê um nome ao seu arquivo <code>.sql</code>, defina o formato como <bold>Plain</bold> e escolha <bold>Encoding: UTF8</bold>.",
        step4: "Certifique-se de que <bold>Apenas esquema</bold> esteja marcado e <bold>Apenas dados</bold> esteja desmarcado na <bold>aba Opções de Dados</bold>.",
        step5: "Clique em <bold>Backup</bold> para exportar o arquivo e depois copie seu conteúdo para o editor de código abaixo."
      },
      workbench: {
        step1: "Abra o <bold>MySQL Workbench</bold> e <bold>conecte-se</bold> ao seu servidor MySQL.",
        step2: "No menu superior, vá para <bold>Servidor > Exportação de Dados</bold>.",
        step3: "Nas <bold>Opções de Exportação</bold>, escolha <bold>Dump Structure Only</bold>.",
        step4: "Marque <bold>Exportar para Arquivo Autônomo</bold>, escolha um local e nome para o arquivo <code>.sql</code>.",
        step5: "Clique em <bold>Iniciar Exportação</bold>. Depois, copie o conteúdo para o editor de código abaixo."
      },
      heidisql: {
        step1: "Abra o <bold>HeidiSQL</bold> e conecte-se ao seu servidor.",
        step2: "Na <bold>barra lateral esquerda</bold>, clique com o botão direito no banco de dados que deseja exportar.",
        step3: "Escolha <bold>Exportar banco de dados como SQL</bold>.",
        step4: "Selecione <bold>Sem dados</bold> e certifique-se de que <bold>Criar</bold> esteja marcado para exportar apenas a estrutura.",
        step5: "Clique em <bold>Exportar</bold> e copie o conteúdo do arquivo <code>.sql</code> para o <bold>editor de código</bold> abaixo."
      },
      dbbrowser: {
        step1: "Inicie o <bold>DB Browser for SQLite</bold>.",
        step2: "Clique em <bold>Arquivo > Abrir Banco de Dados</bold> e selecione seu arquivo <code>.sqlite</code> ou <code>.db</code>.",
        step3: "Vá para <bold>Arquivo > Exportar > Banco de Dados para Arquivo SQL</bold>.",
        step4: "Na janela de diálogo, escolha <bold>Exportar apenas o esquema</bold> e clique em <bold>Salvar</bold>.",
        step5: "Finalmente, copie o conteúdo do arquivo <code>.sql</code> para o <bold>editor de código</bold> abaixo."
      }
    }
  }
};

export const ptLanguage: Language = {
  name: "Portuguese",
  nativeName: "Português",
  code: "pt",
};
