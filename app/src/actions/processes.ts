import { Action } from "@app/constants";
import { Process } from "@shared/templates";

export const setProcessList = (list: Process[]) => ({
  type: Action.PROCESS_SET_LIST,
  payload: list,
});
