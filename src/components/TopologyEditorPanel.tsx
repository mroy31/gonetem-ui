import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { linter, lintGutter } from "@codemirror/lint";
import { StreamLanguage } from "@codemirror/language";
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml";

const yaml = StreamLanguage.define(yamlMode.yaml);

export default function TopologyEditorPanel({
  topology,
}: {
  topology: string;
}): JSX.Element {
  const [content, setContent] = useState(topology);
  const [height, setHeight] = useState("200px");
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (containerRef.current) {
      setHeight(`${containerRef.current.offsetHeight}px`);
      window.addEventListener("resize", () => {
        setHeight(`${containerRef.current.offsetHeight}px`);
        console.log(`${containerRef.current.offsetHeight}px`);
      });
    }
  }, [containerRef]);

/*   const yamlLinter = linter((view) => {
    const diagnostics = [];
  
    try {
      parser.load(view.state.doc);
    } catch (e) {
      const loc = e.mark;
      const from = loc ? loc.position : 0;
      const to = from;
      const severity = "error";
  
      diagnostics.push({
        from,
        to,
        message: e.message,
        severity
      });
    }
  
    return diagnostics;
  }); */

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <div className="bg-base-200 flex-none flex justify-between align-middle p-2">
        <div>
          { content != topology ? (
            <span className="font-semibold">Modified</span>
          ) : (
            <span className="italic">Not modified</span>
          )}
        </div>

        <div className="join">
          <button 
            disabled={content != topology}
            className="btn btn-sm join-item">
            Check
          </button>
          <button
            disabled={content == topology}
            className="btn btn-sm btn-primary join-item"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0" ref={containerRef}>
          <CodeMirror
            height={height}
            maxHeight={height}
            value={content}
            extensions={[yaml, lintGutter()]}
            onChange={(value) => setContent(value)}
          />
      </div>
    </div>
  );
}
