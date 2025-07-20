import { createContext } from "react";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { useDatabaseHistory } from "../database-history/database-history-provider";
import { useReactFlow } from "@xyflow/react";
import { useModal } from "../modal-provider/modal-provider";
import { Modals } from "../modal-provider/modal-contxet";
import { useDiagramOps } from "../diagram-provider/diagram-provider";

const DatabaseHotkeysContext = createContext<null>(null);

interface Props {
    children: React.ReactNode;
}

const DatabaseHotkeysProvider: React.FC<Props> = ({ children }) => {
    const { canUndo, undo, canRedo, redo } = useDatabaseHistory();
    const { openController, showController } = useDiagramOps();
    const { fitView } = useReactFlow();
    const { open } = useModal();

    useHotkeys(["Control+z", "Meta+z"], (event: KeyboardEvent) => {
        event.preventDefault()
        canUndo && undo();
    });

    useHotkeys(["Control+Shift+z", "Meta+Shift+z", "Control+y"], (event: KeyboardEvent) => {
        event.preventDefault()
        canRedo && redo();
    });

    useHotkeys(["Control+a", "Meta+a"], (event: KeyboardEvent) => {
        event.preventDefault()

        fitView({
            duration: 500,
            padding: 0.1,
            maxZoom: 0.9,
        })
    });

    useHotkeys(["Control+o", "Meta+o"], (event: KeyboardEvent) => {
        event.preventDefault()
        open(Modals.OPEN_DATABASE);
    });


    useHotkeys(["Control+b", "Meta+b"], (event: KeyboardEvent) => {
        event.preventDefault()
        openController(!showController)
    });

   
    return (
        <DatabaseHotkeysContext.Provider value={null}>
            {children}
        </DatabaseHotkeysContext.Provider>
    );
};

export default DatabaseHotkeysProvider;