import React, { useEffect, useRef } from "react";
import type cytoscape from "cytoscape";
import { MIN_RECT_SIZE } from "./topologyRects";

const HANDLE_PX = 10;

const CORNERS = [
  { key: "nw", xSign: -1, ySign: -1, cursor: "nwse-resize" },
  { key: "ne", xSign: 1, ySign: -1, cursor: "nesw-resize" },
  { key: "sw", xSign: -1, ySign: 1, cursor: "nesw-resize" },
  { key: "se", xSign: 1, ySign: 1, cursor: "nwse-resize" },
] as const;

export default function RectResizeHandles({
  cy,
  container,
  rectId,
}: {
  cy: cytoscape.Core;
  container: HTMLElement;
  rectId: string;
}): React.JSX.Element {
  const refs = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    const sync = () => {
      const node = cy.getElementById(rectId);
      if (node.empty() || !node.isNode()) return;
      const p = node.position();
      const w = Number(node.data("w"));
      const h = Number(node.data("h"));
      const zoom = cy.zoom();
      const pan = cy.pan();
      CORNERS.forEach((c) => {
        const el = refs.current.get(c.key);
        if (el == null) return;
        const mx = p.x + (c.xSign * w) / 2;
        const my = p.y + (c.ySign * h) / 2;
        el.style.left = `${mx * zoom + pan.x - HANDLE_PX / 2}px`;
        el.style.top = `${my * zoom + pan.y - HANDLE_PX / 2}px`;
      });
    };

    const onGraphChange = () => sync();
    cy.on("pan zoom position data render", onGraphChange);

    const cleanups: (() => void)[] = [];
    CORNERS.forEach((c) => {
      const el = refs.current.get(c.key);
      if (el == null) return;

      const startResize = (down: Event) => {
        down.preventDefault();
        down.stopPropagation();

        const node = cy.getElementById(rectId);
        if (node.empty() || !node.isNode()) return;

        const p = node.position();
        const w = Number(node.data("w"));
        const h = Number(node.data("h"));
        const pin = {
          x: p.x - (c.xSign * w) / 2,
          y: p.y - (c.ySign * h) / 2,
        };

        const move = (moveEv: Event) => {
          const m = moveEv as MouseEvent;
          const rect = container.getBoundingClientRect();
          const zoom = cy.zoom();
          const pan = cy.pan();
          const mx = (m.clientX - rect.left - pan.x) / zoom;
          const my = (m.clientY - rect.top - pan.y) / zoom;

          const dx = mx - pin.x;
          const dy = my - pin.y;
          const sx = dx == 0 ? c.xSign : Math.sign(dx);
          const sy = dy == 0 ? c.ySign : Math.sign(dy);
          const nw = Math.max(MIN_RECT_SIZE.w, Math.abs(dx));
          const nh = Math.max(MIN_RECT_SIZE.h, Math.abs(dy));

          node.data({ w: nw, h: nh });
          node.position({
            x: pin.x + (sx * nw) / 2,
            y: pin.y + (sy * nh) / 2,
          });
        };
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          window.removeEventListener("pointercancel", up);
        };

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
        cleanups.push(up);
      };

      el.addEventListener("pointerdown", startResize);
      cleanups.push(() => el.removeEventListener("pointerdown", startResize));
    });

    sync();
    return () => {
      cy.off("pan zoom position data render", onGraphChange);
      cleanups.forEach((fn) => fn());
    };
  }, [cy, container, rectId]);

  return (
    <div
      data-testid="rect-resize-overlay"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {CORNERS.map((c) => (
        <div
          key={c.key}
          data-testid={`rect-handle-${c.key}`}
          ref={(el) => {
            if (el == null) refs.current.delete(c.key);
            else refs.current.set(c.key, el);
          }}
          style={{
            position: "absolute",
            width: HANDLE_PX,
            height: HANDLE_PX,
            background: "#ffffff",
            border: "1px solid #666666",
            borderRadius: 2,
            cursor: c.cursor,
            pointerEvents: "auto",
            touchAction: "none",
          }}
        />
      ))}
    </div>
  );
}
