import { BaseEffect } from "./effects";

export type ControlType = 
  'light_event' |
  'connection';

export interface ConnectionOperation {
  type: 'disconnect_all' | 'diconnect_target',
  target: string[] | null,
}

export interface Operation {
  type: ControlType,
  data: BaseEffect | ConnectionOperation,
}