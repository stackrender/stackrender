import { Language } from "../types";

export const de = {
  translation: {
    sidebar: {
      tables: "Tabellen",
      relationships: "Beziehungen"
    },
    color_picker: {
      default_color: "Standardfarbe"
    },
    navbar: {
      rename_db: "Datenbank umbenennen",
      search: "Suchen"
    },
    db_controller: {
      filter: "Filter",
      add_table: "Tabelle hinzufügen",
      add_field: "Feld hinzufügen",
      add_index: "Index hinzufügen",
      delete_table: "Tabelle löschen",
      duplicate: "Duplizieren",
      add_relationship: "Beziehung hinzufügen",
      show_code: "Code anzeigen",
      fields: "Felder",
      indexes: "Indizes",
      note: "Notiz",
      name: "Name",
      type: "Typ",
      nullable: "Nullwert zulässig",
      select_fields: "Felder auswählen",
      unique: "Eindeutig",
      table_note: "Tabellennotiz",
      collapse: "Alle einklappen",
      primary_key: "Primärschlüssel",
      foreign_key: "Fremdschlüssel",
      source_table: "Quelltabelle",
      referenced_table: "Referenzierte Tabelle",
      select_table: "Tabelle auswählen",
      select_field: "Feld auswählen",
      empty_list: {
        no_tables: "Keine Tabellen",
        no_tables_description: "Erstelle eine Tabelle, um zu beginnen.",
        no_relationships: "Keine Beziehungen",
        no_relationships_description: "Erstelle Beziehungen, um zwei Tabellen zu verbinden"
      },
      cardinality: {
        name: "Kardinalität",
        one_to_one: "Eins zu eins",
        one_to_many: "Eins zu viele",
        many_to_one: "Viele zu eins",
        many_to_many: "Viele zu viele"
      },
      foreign_key_actions: {
        title: "Fremdschlüssel-Aktionen",
        on_delete: "Beim Löschen",
        on_update: "Beim Aktualisieren",
        actions: {
          no_action: "Keine Aktion",
          cascade: "Kaskadieren",
          set_null: "Auf Null setzen",
          set_default: "Standardwert setzen",
          restrict: "Einschränken"
        }
      },
      field_settings: {
        title: "Feld-Einstellungen",
        unique: "Eindeutig",
        unsigned: "Ohne Vorzeichen",
        numeric_setting: "Numerische Einstellung",
        decimal_setting: "Dezimaleinstellung",
        zeroFill: "Mit Nullen auffüllen",
        autoIncrement: "Automatische Erhöhung",
        note: "Notiz",
        delete_field: "Feld löschen",
        field_note: "Feldnotiz",
        precision: "Genauigkeit",
        text_setting: "Texteinstellung",
        charset: "Zeichensatz",
        collation: "Sortierung",
        scale: "Skalierung",
        max_length: "Maximale Länge",
        integer_width: "Ganzzahlbreite",
        width: "Breite",
        default_value: "Standardwert",
        value: "Wert",
        length: "Länge",
        values: "Werte",
        type_enter: "Tippen und Enter drücken",
        precision_def: "Zulässige Gesamtanzahl an Ziffern (vor + nach dem Dezimalpunkt).",
        scale_def: "Ziffern nach dem Dezimalpunkt.",
        time_default_value: {
          no_value: "Kein Wert",
          custom: "Benutzerdefinierte Zeit",
          now: "Jetzt"
        },
        errors: {
          max_length: "muss eine positive Zahl ohne Dezimalstellen sein.",
          integer_default_value: "Ungültiger Standardwert für Ganzzahl",
          precision: "Genauigkeit muss eine positive Zahl ohne Dezimalstellen sein.",
          scale: "Skalierung muss eine positive Zahl ohne Dezimalstellen sein.",
          scale_max_value: "Skalierung muss ≤ Genauigkeit sein."
        },
        pick_value: "Wert auswählen"
      },
      delete: "Löschen",
      index_setting: "Index-Einstellungen",
      table_actions: "Tabellenaktionen",
      actions: "Aktionen",
      delete_index: "Index löschen",
      index_name: "Indexname",
      create_relationship: "Beziehung erstellen",
      relationship_error: "Um eine Beziehung zu erstellen, müssen Primär- und Fremdschlüssel denselben Typ haben.",
      invalid_relationship: {
        title: "Ungültige Beziehung",
        description: "Der Typ des Quellschlüssels stimmt nicht mit dem des referenzierten Schlüssels überein. Bitte stelle sicher, dass beide den gleichen Datentyp haben."
      },
      circular_dependency: {
        title: "Zirkuläre Abhängigkeit erkannt",
        toast_description: "Eine zirkuläre Referenz zwischen Tabellen wurde gefunden. Überprüfe das Diagramm links und entferne eine der Beziehungen.",
        description: "Dein Schema enthält eine zirkuläre Fremdschlüssel-Beziehung zwischen Tabellen. Um dies zu beheben,",
        suggestion: "entferne eine der unten aufgeführten Beziehungen, die den Kreis verursachen.",
        remove_relationship: "Beziehung entfernen"
      }
    },
    table: {
      double_click: "Doppelklick zum Bearbeiten",
      overlapping_tables: "Überlappende Tabellen",
      show_more: "Mehr anzeigen",
      show_less: "Weniger anzeigen"
    },
    control_buttons: {
      redo: "Wiederholen",
      undo: "Rückgängig",
      zoom_in: "Vergrößern",
      zoom_out: "Verkleinern",
      adjust_positions: "Positionen anpassen",
      show_all: "Alles anzeigen"
    },
    menu: {
      file: "Datei",
      new: "Neu",
      open: "Öffnen",
      save: "Speichern",
      import: "Importieren",
      json: ".json",
      dbml: ".dbml",
      mysql: "MySQL",
      postgresql: "PostgreSQL",
      export_sql: "SQL exportieren",
      generic: "Allgemein",
      export_orm_models: "ORM-Modelle exportieren",
      delete_project: "Projekt löschen",
      edit: "Bearbeiten",
      undo: "Rückgängig",
      redo: "Wiederholen",
      clear: "Leeren",
      view: "Ansicht",
      hide_controller: "Controller ausblenden",
      show_controller: "Controller anzeigen",
      cardinality_style: "Kardinalitätsstil",
      hidden: "Versteckt",
      numeric: "Numerisch",
      symbolic: "Symbolisch",
      theme: "Design",
      light: "Hell",
      dark: "Dunkel",
      help: "Hilfe",
      show_docs: "Dokumentation anzeigen",
      join_discord: "Discord beitreten"
    },
    modals: {
      close: "Schließen",
      create: "Erstellen",
      pick_database: "Wähle deine Datenbank.",
      create_database_header: "Jede Datenbank bietet unterschiedliche Funktionen.",
      db_name: "Datenbankname",
      db_name_error: "Bitte gib einen Datenbanknamen ein",
      continue: "Weiter",
      open: "Öffnen",
      open_database: "Datenbank öffnen",
      open_database_header: "Wähle eine Datenbank aus der Liste aus.",
      delete_database: "Datenbank löschen",
      delete_database_content: "Diese Aktion ist unwiderruflich und wird das Diagramm dauerhaft löschen.",
      delete: "Löschen",
      empty_diagram: "Leeres Diagramm",
      import_database: {
        title: "Datenbank importieren",
        import: "Importieren",
        import_options: "Möchtest du importieren mit:",
        import_error: "SQL-Parsing-Fehler",
        import_error_description: "Wir konnten dein SQL nicht importieren, da es ungültige Syntax enthält.",
        import_warning: "SQL-Parsing-Warnung",
        import_warning_description: "Einige Elemente konnten aufgrund nicht unterstützter oder unvollständiger Deklarationen nicht verarbeitet werden."
      },
      open_database_table: {
        dialect: "Dialekt",
        name: "Name",
        created_at: "Erstellt am",
        tables: "Tabellen"
      } , 
      export_sql: "SQL exportieren",
      export_sql_header: "Exportiere dein Datenbankdiagramm als SQL-Code"
    },
    clipboard: {
      copy: "Kopieren",
      copied: "Kopiert"
    },
    connection_status: {
      online: "Online",
      offline: "Offline",
      saving: "Speichern...",
      saved: "Gespeichert",
      last_synced: "Zuletzt synchronisiert",
      min_ago: "Min. zuvor",
      hour_ago: "Std. zuvor",
      just_now: "Gerade eben"
    },
    import: {
      instructions: "Anleitung",
      install: "Installieren",
      run_command: "Führe den folgenden Befehl im Terminal aus.",
      example: "Beispiel",
      copy_code: "Kopiere den Inhalt der .sql-Datei in den Code-Editor unten.",
      pg_admin: {
        step1: "Öffne <bold>Pg Admin</bold>.",
        step2: "Rechtsklicke auf deine Datenbank und wähle <bold>Backup</bold>.",
        step3: "Benenne deine <code>.sql</code>-Datei, stelle Format auf <bold>Plain</bold> und wähle <bold>Encoding: UTF8</bold>.",
        step4: "Stelle sicher, dass <bold>Only schema</bold> aktiviert und <bold>Only data</bold> deaktiviert ist.",
        step5: "Klicke auf <bold>Backup</bold>, um die Datei zu exportieren, und kopiere dann den Inhalt in den untenstehenden Editor."
      },
      workbench: {
        step1: "Öffne <bold>MySQL Workbench</bold> und stelle eine Verbindung zu deinem Server her.",
        step2: "Gehe im oberen Menü zu <bold>Server > Data Export</bold>.",
        step3: "Wähle unter <bold>Export Options</bold> <bold>Dump Structure Only</bold>.",
        step4: "Aktiviere <bold>Export to Self-Contained File</bold>, wähle einen Speicherort und Dateinamen.",
        step5: "Klicke auf <bold>Start Export</bold> und kopiere den Inhalt in den Code-Editor unten."
      },
      heidisql: {
        step1: "Öffne <bold>HeidiSQL</bold> und verbinde dich mit deinem Server.",
        step2: "Klicke in der <bold>linken Seitenleiste</bold> mit der rechten Maustaste auf die Datenbank.",
        step3: "Wähle <bold>Export database as SQL</bold>.",
        step4: "Wähle <bold>No data</bold> und stelle sicher, dass <bold>Create</bold> aktiviert ist.",
        step5: "Klicke auf <bold>Export</bold> und kopiere den Inhalt der <code>.sql</code>-Datei in den Editor."
      },
      dbbrowser: {
        step1: "Starte <bold>DB Browser for SQLite</bold>.",
        step2: "Gehe zu <bold>File > Open Database</bold> und wähle deine <code>.sqlite</code>- oder <code>.db</code>-Datei.",
        step3: "Gehe zu <bold>File > Export > Database to SQL file</bold>.",
        step4: "Wähle im Dialog <bold>Export schema only</bold> und klicke auf <bold>Save</bold>.",
        step5: "Kopiere abschließend den Inhalt der <code>.sql</code>-Datei in den Editor."
      }
    }
  }
}

export const deLanguage: Language = {
  name: "German",
  nativeName: "Deutsch",
  code: "de",
};
