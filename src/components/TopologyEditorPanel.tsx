import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { type Diagnostic, linter, lintGutter } from "@codemirror/lint";
import { StreamLanguage } from "@codemirror/language";
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml";
import parser from 'js-yaml';
import { IPrjAction, PrjActionKing } from "./ProjectPanel";
import { useAppContext } from "../context";

const yaml = StreamLanguage.define(yamlMode.yaml);

export default function TopologyEditorPanel({
  prjId,
  topology,
  dispatch,
}: {
  prjId: string,
  topology: string;
  dispatch: React.Dispatch<IPrjAction>;
}): JSX.Element {
  const { setError } = useAppContext();
  const [content, setContent] = useState(topology);
  const [ showCheckMsg, setShowCheckMsg ] = useState(false);
  const [height, setHeight] = useState("200px");
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (containerRef.current) {
      setHeight(`${containerRef.current.offsetHeight}px`);

      const resizeCb = () => {
        setHeight(`${containerRef.current.offsetHeight}px`);
      };
      window.addEventListener("resize", resizeCb);
      return () => window.removeEventListener("resize", resizeCb);
    }
  }, [containerRef]);

  const handleWrite = () => {
    window.api.writeTopologyFile(prjId, content).then((res) => {
      res.status 
        ? dispatch({type: PrjActionKing.TOPOLOGY, topology: content}) 
        : setError(res.error);
    });
  }

  const handleCheck = () => {
    window.api.checkTopologyFile(prjId).then((res) => {
      res.status 
        ? setShowCheckMsg(true)
        : setError(res.error);
    });
  }


  const yamlLinter = linter((view) => {
    const diagnostics: Diagnostic[] = [];
  
    try {
      parser.load(view.state.doc.toString());
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
  });

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
            onClick={handleCheck}
            disabled={content != topology}
            className="btn btn-sm join-item">
            Check
          </button>
          <button
            onClick={handleWrite}
            disabled={content == topology}
            className="btn btn-sm btn-primary join-item"
          >
            Write
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0" ref={containerRef}>
          <CodeMirror
            height={height}
            maxHeight={height}
            value={content}
            extensions={[yaml, lintGutter(), yamlLinter]}
            onChange={(value) => setContent(value)}
          />
      </div>


      { showCheckMsg && (
        <div className="toast">
          <div className="alert alert-success flex gap-2 align-middle">
            <span>Topology OK</span>
            <button
                className='btn btn-outline btn-neutral'
                onClick={() => setShowCheckMsg(false)}
            >
                X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
