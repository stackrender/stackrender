import useToast from "@/hooks/use-toast";
import { DatabaseDialect, DatabaseType, getDatabaseByDialect, IDENTIFIER_ERROR, IDENTIFIER_MAX_LENGTH } from "@/lib/database";
import { isValidIdentifier } from "@/utils/database";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";



interface databaseInvalidIdentifierType {
    identifierError: IDENTIFIER_ERROR,
    setIdentifierError: Dispatch<SetStateAction<IDENTIFIER_ERROR>>,
    showIdentifierError: () => void,
    identifierMaxLength: number;
    identifierType? : 'table' | 'constraint' | "index" | "column"
}

export const useDatabaseInvalidIdentifier = (identifier: string, dialect?: DatabaseDialect , identifierType = "table"): databaseInvalidIdentifierType => {

    const raise = useToast();
    const { t } = useTranslation();

    const [identifierError, setIdentifierError] = useState<IDENTIFIER_ERROR>(null);

    const identifierMaxLength = useMemo(() => {
        return dialect ? IDENTIFIER_MAX_LENGTH[dialect] : 255
    }, [dialect])


    useEffect(() => {
        setIdentifierError(isValidIdentifier(
            identifier.trim(),
            dialect
        ))
    }, [identifier]);

    const showIdentifierError = useCallback(() => {
        let title: string | undefined;
        let description: string | undefined;
        const identifier: string = t(`db_controller.validation.identifiers.${identifierType}`);

        if (identifierError == "empty") {
            title = t("db_controller.validation.identifier_required").replace("${identifier}", identifier.toLocaleLowerCase())
            description = t("db_controller.validation.identifier_required_description").replace("${identifier}", identifier)
        }
        if (identifierError == "invalid") {
            title = t("db_controller.validation.invalid_identifier").replace("${identifier}", identifier.toLocaleLowerCase())
            description = t("db_controller.validation.invalid_identifier_description").replace("${identifier}", identifier.toLocaleLowerCase())
        }

        if (identifierError === "max_length" && dialect) {
            const databaseType: DatabaseType = getDatabaseByDialect(dialect)
            title = t("db_controller.validation.identifier_length").replace("${identifier}", identifier)
            description = t("db_controller.validation.identifier_length_description")
                .replace("${identifier}", identifier.toLocaleLowerCase())
                .replace("${dialect}", databaseType.name).replace("${length}", String(identifierMaxLength))
        }
        if (title && description) {
            raise(title, description, "ERROR")
        }

    }, [identifierError, identifierMaxLength, dialect , identifierType]);


    return {
        identifierError,
        setIdentifierError,
        showIdentifierError,
        identifierMaxLength
    }
}