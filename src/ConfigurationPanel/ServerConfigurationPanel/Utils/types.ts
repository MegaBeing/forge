import { ServerTaskType } from "../../Utils/types";

export interface IServerConfiguration {
  ram: number;
  cpu: number;
  storage: number;
  network: number;
  taskType: ServerTaskType;
}
