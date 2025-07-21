import { Language } from "../types";

export const ru = {
  translation: {
    sidebar: {
      tables: "Таблицы",
      relationships: "Связи"
    },
    color_picker: {
      default_color: "Цвет по умолчанию"
    },
    navbar: {
      rename_db: "Переименовать базу данных",
      search: "Поиск"
    },
    db_controller: {
      filter: "Фильтр",
      add_table: "Добавить таблицу",
      add_field: "Добавить поле",
      add_index: "Добавить индекс",
      delete_table: "Удалить таблицу",
      duplicate: "Дублировать",
      add_relationship: "Добавить связь",
      show_code: "Показать код",
      fields: "Поля",
      indexes: "Индексы",
      note: "Заметка",
      name: "Имя",
      type: "Тип",
      nullable: "Допускает NULL",
      select_fields: "Выберите поля",
      unique: "Уникальный",
      table_note: "Заметка к таблице",
      collapse: "Свернуть все",
      primary_key: "Первичный ключ",
      foreign_key: "Внешний ключ",
      source_table: "Исходная таблица",
      referenced_table: "Связанная таблица",
      select_table: "Выберите таблицу",
      select_field: "Выберите поле",
      empty_list: {
        no_tables: "Нет таблиц",
        no_tables_description: "Создайте таблицу, чтобы начать.",
        no_relationships: "Нет связей",
        no_relationships_description: "Создайте связи для соединения двух таблиц"
      },
      cardinality: {
        name: "Кардинальность",
        one_to_one: "Один к одному",
        one_to_many: "Один ко многим",
        many_to_one: "Многие к одному",
        many_to_many: "Многие ко многим"
      },
      foreign_key_actions: {
        title: "Действия внешнего ключа",
        on_delete: "При удалении",
        on_update: "При обновлении",
        actions: {
          no_action: "Без действия",
          cascade: "Каскад",
          set_null: "Установить NULL",
          set_default: "Установить по умолчанию",
          restrict: "Ограничить"
        }
      },
      field_settings: {
        title: "Настройки поля",
        unique: "Уникальный",
        unsigned: "Без знака",
        numeric_setting: "Числовые настройки",
        decimal_setting: "Десятичные настройки",
        zeroFill: "Дополнение нулями",
        autoIncrement: "Автоинкремент",
        note: "Заметка",
        delete_field: "Удалить поле",
        field_note: "Заметка к полю",
        precision: "Точность",
        text_setting: "Настройки текста",
        charset: "Кодировка",
        collation: "Сравнение",
        scale: "Масштаб",
        max_length: "Макс. длина",
        integer_width: "Ширина целого числа",
        width: "Ширина",
        default_value: "Значение по умолчанию",
        value: "Значение",
        length: "Длина",
        values: "Значения",
        type_enter: "Введите и нажмите Enter",
        precision_def: "Общее количество допустимых цифр (до и после запятой).",
        scale_def: "Допустимое количество цифр после запятой.",
        time_default_value: {
          no_value: "Нет значения",
          custom: "Произвольное время",
          now: "Сейчас"
        },
        errors: {
          max_length: "должно быть положительным числом без десятичных.",
          integer_default_value: "Недопустимое значение по умолчанию для целого",
          precision: "Точность должна быть положительным числом без десятичных.",
          scale: "Масштаб должен быть положительным числом без десятичных.",
          scale_max_value: "Масштаб должен быть ≤ точности."
        },
        pick_value: "Выберите значение"
      },
      delete: "Удалить",
      index_setting: "Настройки индекса",
      table_actions: "Действия с таблицей",
      actions: "Действия",
      delete_index: "Удалить индекс",
      index_name: "Имя индекса",
      create_relationship: "Создать связь",
      relationship_error: "Для создания связи типы первичного и внешнего ключа должны совпадать.",
      invalid_relationship: {
        title: "Недопустимая связь",
        description: "Тип исходного ключа не совпадает с типом связанного ключа. Убедитесь, что оба ключа имеют одинаковый тип данных."
      },
      circular_dependency: {
        title: "Обнаружена циклическая зависимость",
        toast_description: "Обнаружена циклическая ссылка между таблицами. Проверьте диаграмму слева и удалите одну из связей, чтобы исправить.",
        description: "В вашей схеме есть циклическая связь между таблицами. Чтобы устранить её,",
        suggestion: "удалите одну из перечисленных ниже связей, вызывающих цикл.",
        remove_relationship: "Удалить связь"
      }
    },
    table: {
      double_click: "Дважды щелкните для редактирования",
      overlapping_tables: "Перекрывающиеся таблицы",
      show_more: "Показать больше",
      show_less: "Показать меньше"
    },
    control_buttons: {
      redo: "Повтор",
      undo: "Отменить",
      zoom_in: "Увеличить",
      zoom_out: "Уменьшить",
      adjust_positions: "Настроить позиции",
      show_all: "Показать все"
    },
    menu: {
      file: "Файл",
      new: "Новый",
      open: "Открыть",
      save: "Сохранить",
      import: "Импорт",
      json: ".json",
      dbml: ".dbml",
      mysql: "MySql",
      postgresql: "PostgreSQL",
      export_sql: "Экспорт SQL",
      generic: "Общий",
      export_orm_models: "Экспорт ORM моделей",
      delete_project: "Удалить проект",
      edit: "Редактировать",
      undo: "Отменить",
      redo: "Повторить",
      clear: "Очистить",
      view: "Вид",
      hide_controller: "Скрыть панель управления",
      show_controller: "Показать панель управления",
      cardinality_style: "Стиль кардинальности",
      hidden: "Скрытый",
      numeric: "Числовой",
      symbolic: "Символический",
      theme: "Тема",
      light: "Светлая",
      dark: "Тёмная",
      help: "Помощь",
      show_docs: "Показать документацию",
      join_discord: "Присоединиться к Discord"
    },
    modals: {
      close: "Закрыть",
      create: "Создать",
      pick_database: "Выберите вашу базу данных.",
      create_database_header: "Каждая база данных предлагает уникальные функции и возможности.",
      db_name: "Имя базы данных",
      db_name_error: "Пожалуйста, укажите имя базы данных",
      continue: "Продолжить",
      open: "Открыть",
      open_database: "Открыть базу данных",
      open_database_header: "Откройте базу данных, выбрав одну из списка.",
      delete_database: "Удалить базу данных",
      delete_database_content: "Это действие необратимо и навсегда удалит диаграмму.",
      delete: "Удалить",
      import_database: {
        title: "Импортируйте вашу базу данных",
        import: "Импорт",
        import_options: "Вы хотите импортировать с помощью:",
        import_error: "Ошибка разбора SQL",
        import_error_description: "Не удалось импортировать SQL, так как он содержит недопустимый синтаксис.",
        import_warning: "Предупреждение разбора SQL",
        import_warning_description: "Некоторые элементы не были обработаны из-за неподдерживаемых или неполных объявлений."
      },
      export_sql: "Экспорт SQL",
      export_sql_header: "Экспортируйте диаграмму базы данных в виде SQL-кода"
    },
    clipboard: {
      copy: "Копировать",
      copied: "Скопировано"
    },
    connection_status: {
      online: "Онлайн",
      offline: "Оффлайн",
      saving: "Сохранение",
      saved: "Сохранено",
      last_synced: "Последняя синхронизация",
      min_ago: "мин назад",
      hour_ago: "час назад",
      just_now: "Только что"
    },
    import: {
      instructions: "Инструкции",
      install: "Установить",
      run_command: "Выполните следующую команду в терминале.",
      example: "Пример",
      copy_code: "Скопируйте содержимое .sql файла в кодовую секцию ниже.",
      pg_admin: {
        step1: "Откройте <bold>Pg Admin</bold>.",
        step2: "Щёлкните правой кнопкой мыши по базе данных и выберите <bold>Резервное копирование</bold>.",
        step3: "Назовите файл <code>.sql</code>, выберите <bold>Формат: Обычный</bold> и <bold>Кодировка: UTF8</bold>.",
        step4: "Убедитесь, что <bold>Только схема</bold> включена, а <bold>Только данные</bold> выключены.",
        step5: "Нажмите <bold>Резервное копирование</bold> для экспорта, затем скопируйте содержимое в редактор кода ниже."
      },
      workbench: {
        step1: "Откройте <bold>MySQL Workbench</bold> и <bold>подключитесь</bold> к серверу.",
        step2: "В верхнем меню перейдите в <bold>Сервер > Экспорт данных</bold>.",
        step3: "Выберите <bold>Только структура</bold> в <bold>Настройках экспорта</bold>.",
        step4: "Выберите <bold>Экспорт в автономный файл</bold>, укажите путь и имя файла <code>.sql</code>.",
        step5: "Нажмите <bold>Начать экспорт</bold>, затем скопируйте содержимое в редактор кода ниже."
      },
      heidisql: {
        step1: "Откройте <bold>HeidiSQL</bold> и подключитесь к серверу.",
        step2: "В <bold>левой панели</bold> щёлкните правой кнопкой по нужной базе.",
        step3: "Выберите <bold>Экспортировать базу как SQL</bold>.",
        step4: "Выберите <bold>Без данных</bold>, включите <bold>Создание</bold> для экспорта только структуры.",
        step5: "Нажмите <bold>Экспорт</bold> и скопируйте содержимое файла <code>.sql</code> в редактор."
      },
      dbbrowser: {
        step1: "Запустите <bold>DB Browser for SQLite</bold>.",
        step2: "Перейдите в <bold>Файл > Открыть базу данных</bold> и выберите <code>.sqlite</code> или <code>.db</code> файл.",
        step3: "Выберите <bold>Файл > Экспорт > База данных в SQL файл</bold>.",
        step4: "Выберите <bold>Экспортировать только схему</bold> и нажмите <bold>Сохранить</bold>.",
        step5: "Скопируйте содержимое <code>.sql</code> файла в редактор ниже."
      }
    }
  }
}


export const ruLanguage: Language = {
  name: "Russian",
  nativeName: "Русский",
  code: "ru",
};
