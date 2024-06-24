
import React, { useMemo, useCallback } from "react";

export default function ProjectContextBar({
    selectedEdge,
}: {
    selectedEdge: string;
}): JSX.Element {
    return (
        <div className="flex-none flex bg-base-200">
            <div className="flex-1 p-2 ml-2">
                { selectedEdge != "" && (
                    <span>Selected edge(s): {selectedEdge}</span>
                )}
            </div>

            <div className="flex-none join p-1">
                <button className="btn btn-outline btn-sm">
                    Open all consoles
                </button>
            </div>
        </div>
    );

}