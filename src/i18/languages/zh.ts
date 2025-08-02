import { Language } from "../types";

export const zh = {
  translation: {
    sidebar: {
      tables: "数据表",
      relationships: "关系"
    },

    color_picker: {
      default_color: "默认颜色"
    },
    navbar: {
      rename_db: "重命名数据库",
      search: "搜索"
    },
    db_controller: {
      filter: "筛选",
      add_table: "添加表",
      add_field: "添加字段",
      add_index: "添加索引",
      delete_table: "删除表",
      duplicate: "复制",
      add_relationship: "添加关系",
      show_code: "显示代码",
      fields: "字段",
      indexes: "索引",
      note: "备注",
      name: "名称",
      type: "类型",
      nullable: "可为空",
      select_fields: "选择字段",
      unique: "唯一",
      table_note: "表备注",
      collapse: "全部折叠",
      primary_key: "主键",
      foreign_key: "外键",

      source_table: "源表",
      referenced_table: "引用表",

      select_table: "选择表",
      select_field: "选择字段",

      empty_list: {
        no_tables: "暂无数据表",
        no_tables_description: "创建一个表以开始。",
        no_relationships: "暂无关系",
        no_relationships_description: "创建关系以连接两个表"
      },

      cardinality: {
        name: "基数",
        one_to_one: "一对一",
        one_to_many: "一对多",
        many_to_one: "多对一",
        many_to_many: "多对多"
      },

      foreign_key_actions: {
        title: "外键操作",
        on_delete: "删除时",
        on_update: "更新时",
        actions: {
          no_action: "无操作",
          cascade: "级联",
          set_null: "设为 NULL",
          set_default: "设为默认值",
          restrict: "限制"
        }
      },

      field_settings: {
        title: "字段设置",
        unique: "唯一",
        unsigned: "无符号",
        numeric_setting: "数值设置",
        decimal_setting: "小数设置",
        zeroFill: "零填充",
        autoIncrement: "自动递增",
        note: "备注",
        delete_field: "删除字段",
        field_note: "字段备注",
        precision: "精度",
        text_setting: "文本设置",
        charset: "字符集",
        collation: "排序规则",
        scale: "小数位数",
        max_length: "最大长度",
        integer_width: "整数宽度",
        width: "宽度",
        default_value: "默认值",
        value: "值",
        length: "长度",
        values: "值集合",
        type_enter: "输入并按回车",
        precision_def: "允许的总位数（小数点前+后）。",
        scale_def: "小数点后的位数。",
        time_default_value: {
          no_value: "无值",
          custom: "自定义时间",
          now: "当前时间"
        },
        errors: {
          max_length: "必须为正整数，不能为小数。",
          integer_default_value: "整数默认值无效",
          precision: "精度必须为正整数，不能为小数。",
          scale: "小数位数必须为正整数，不能为小数。",
          scale_max_value: "小数位数必须小于等于精度值。"
        },
        pick_value: "选择值"
      },

      delete: "删除",
      index_setting: "索引设置",
      table_actions: "表操作",
      actions: "操作",
      delete_index: "删除索引",
      index_name: "索引名称",
      create_relationship: "创建关系",
      relationship_error: "要创建关系，主键和外键的数据类型必须相同。",

      invalid_relationship: {
        title: "无效关系",
        description: "源键类型与引用键类型不匹配，请确保两个键的数据类型一致。"
      },

      circular_dependency: {
        title: "检测到循环依赖",
        toast_description: "发现表之间存在循环引用。请检查左侧图表并移除其中一个关系以修复。",
        description: "您的架构中存在表之间的循环外键关系。要修复它，",
        suggestion: "请移除以下导致循环的关系之一。",
        remove_relationship: "移除关系"
      }
    },

    table: {
      double_click: "双击进行编辑",
      overlapping_tables: "表重叠",
      show_more: "显示更多",
      show_less: "显示更少"
    },

    control_buttons: {
      redo: "重做",
      undo: "撤销",
      zoom_in: "放大",
      zoom_out: "缩小",
      adjust_positions: "调整位置",
      show_all: "显示全部"
    },

    menu: {
      file: "文件",
      new: "新建",
      open: "打开",
      save: "保存",
      import: "导入",
      json: ".json",
      dbml: ".dbml",
      mysql: "MySql",
      postgresql: "Postgresql",
      export_sql: "导出 SQL",
      generic: "通用",
      export_orm_models: "导出 ORM 模型",
      delete_project: "删除项目",
      edit: "编辑",
      undo: "撤销",
      redo: "重做",
      clear: "清除",
      view: "视图",
      hide_controller: "隐藏控制器",
      show_controller: "显示控制器",
      cardinality_style: "基数样式",
      hidden: "隐藏",
      numeric: "数值",
      symbolic: "符号",
      theme: "主题",
      light: "浅色",
      dark: "深色",
      help: "帮助",
      show_docs: "查看文档",
      join_discord: "加入 Discord"
    },

    modals: {
      close: "关闭",
      create: "创建",
      pick_database: "选择您的数据库。",
      create_database_header: "每种数据库提供不同的功能与特性。",
      db_name: "数据库名称",
      db_name_error: "请输入数据库名称",
      continue: "继续",
      open: "打开",
      open_database: "打开数据库",
      open_database_header: "从列表中选择一个数据库进行打开。",
      delete_database: "删除数据库",
      delete_database_content: "该操作不可撤销，将永久删除该图表。",
      delete: "删除",
      empty_diagram: "空图表",
      import_database: {
        title: "导入数据库",
        import: "导入",
        import_options: "请选择导入方式：",
        import_error: "SQL 解析错误",
        import_error_description: "我们无法导入您的 SQL，因为它包含无效语法。",
        import_warning: "SQL 解析警告",
        import_warning_description: "由于不支持或不完整的声明，某些元素无法处理。"
      },
      open_database_table: {
        dialect: "方言",
        name: "名称",
        created_at: "创建于",
        tables: "表"
      },
      export_sql: "导出 SQL",
      export_sql_header: "将您的数据库图导出为 SQL 代码"
    },

    clipboard: {
      copy: "复制",
      copied: "已复制"
    },

    connection_status: {
      online: "在线",
      offline: "离线",
      saving: "保存中",
      saved: "已保存",
      last_synced: "上次同步",
      min_ago: "分钟前",
      hour_ago: "小时前",
      just_now: "刚刚"
    },

    import: {
      instructions: "说明",
      install: "安装",
      run_command: "在终端中运行以下命令。",
      example: "示例",
      copy_code: "将 .sql 文件的内容复制到下方代码区域。",
      pg_admin: {
        step1: "打开 <bold>Pg Admin</bold>。",
        step2: "右键点击数据库并选择 <bold>备份</bold>。",
        step3: "命名 <code>.sql</code> 文件，设置格式为 <bold>纯文本</bold>，编码为 <bold>UTF8</bold>。",
        step4: "确保 <bold>仅结构</bold> 选中，<bold>仅数据</bold> 未选中。",
        step5: "点击 <bold>备份</bold> 进行导出，然后将内容复制到下方代码编辑器。"
      },
      workbench: {
        step1: "打开 <bold>MySQL Workbench</bold> 并连接到服务器。",
        step2: "顶部菜单选择 <bold>Server > 数据导出</bold>。",
        step3: "在 <bold>导出选项</bold> 中选择 <bold>仅导出结构</bold>。",
        step4: "勾选 <bold>导出为自包含文件</bold>，设置保存位置和文件名。",
        step5: "点击 <bold>开始导出</bold>，然后复制 .sql 文件内容至代码编辑器。"
      },
      heidisql: {
        step1: "<bold>打开 HeidiSQL</bold> 并连接到服务器。",
        step2: "在 <bold>左侧栏中右键</bold> 要导出的数据库。",
        step3: "选择 <bold>导出为 SQL</bold>。",
        step4: "选择 <bold>无数据</bold>，并勾选 <bold>创建</bold> 以仅导出结构。",
        step5: "点击 <bold>导出</bold>，将 .sql 文件内容复制到下方代码编辑器中。"
      },
      dbbrowser: {
        step1: "启动 <bold>DB Browser for SQLite</bold>。",
        step2: "点击 <bold>文件 > 打开数据库</bold>，选择您的 <code>.sqlite</code> 或 <code>.db</code> 文件。",
        step3: "顶部菜单选择 <bold>文件 > 导出 > 导出为 SQL 文件</bold>。",
        step4: "选择 <bold>仅导出结构</bold> 并点击 <bold>保存</bold>。",
        step5: "将 .sql 文件内容复制到下方 <bold>代码编辑器</bold> 中。"
      }
    }
  }
};

export const zhLanguage: Language = {
  name: "Chinese",
  nativeName: "简体中文",
  code: "zh",
};
