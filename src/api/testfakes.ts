import { EventEmitter } from "events";
import { vi } from "vitest";
import { StatusCode } from "../proto/netem_pb";

export const IPC_EVENT = undefined as never;

export const okStatus = () => ({
  getCode: () => StatusCode.OK as StatusCode,
  getError: () => "",
});

export const errorStatus = (msg: string) => ({
  getCode: () => StatusCode.ERROR as StatusCode,
  getError: () => msg,
});

export const resWith = (
  status: ReturnType<typeof okStatus> | ReturnType<typeof errorStatus> | undefined,
  extra: Record<string, () => unknown> = {}
) => ({
  getStatus: () => status,
  ...extra,
});

export type UnaryHandler = (
  request: unknown,
  cb: (err: Error | null, res: unknown) => void
) => void;

export function unary(result: { err?: Error; res?: unknown }): UnaryHandler {
  return (_request, cb) => {
    cb(result.err ?? null, result.res ?? null);
  };
}

export function streaming(stub: EventEmitter) {
  return vi.fn(() => stub);
}

export const makeStream = (): EventEmitter => new EventEmitter();

export const makeFakeWindow = () => ({
  webContents: { send: vi.fn() },
});

export function expectOk<T extends { status: boolean }>(res: T): Extract<T, { status: true }> {
  if (res.status !== true) {
    throw new Error(`expected success, got: ${JSON.stringify(res)}`);
  }
  return res as Extract<T, { status: true }>;
}

export function expectErr<T extends { status: boolean }>(res: T): Extract<T, { status: false }> {
  if (res.status !== false) {
    throw new Error(`expected failure, got: ${JSON.stringify(res)}`);
  }
  return res as Extract<T, { status: false }>;
}
