import { InputType } from "@/Utils/types";
import { ConfigurationType, ServerTaskType } from "../../Utils/types";
import { z } from "zod";
import { IServerConfiguration } from "./types";


export const serverConfigurationList: ConfigurationType<IServerConfiguration>[] = [
  {
    key: "ram",
    inputType: InputType.SELECT,
    label: "Ram",
    schema: z.number(),
    options: [
      { label: "1 GB", value: 1 },
      { label: "2 GB", value: 2 },
      { label: "4 GB", value: 4 },
      { label: "8 GB", value: 8 },
      { label: "16 GB", value: 16 },
    ],
  },
  {
    key: "cpu",
    inputType: InputType.SELECT,
    label: "CPU",
    schema: z.number(),
    options: [
      { label: "1 Core", value: 1 },
      { label: "2 Cores", value: 2 },
      { label: "4 Cores", value: 4 },
      { label: "8 Cores", value: 8 },
      { label: "16 Cores", value: 16 },
    ],
  },
  {
    key: "storage",
    inputType: InputType.SELECT,
    label: "Storage",
    schema: z.number(),
    options: [
      { label: "100 GB", value: 100 },
      { label: "200 GB", value: 200 },
      { label: "400 GB", value: 400 },
      { label: "800 GB", value: 800 },
    ],
  },
  {
    key: "network",
    inputType: InputType.SELECT,
    label: "Network",
    schema: z.number(),
    options: [
      { label: "100 MBPS", value: 100 },
      { label: "200 MBPS", value: 200 },
      { label: "400 MBPS", value: 400 },
      { label: "800 MBPS", value: 800 },
    ],
  },
  {
    key: "taskType",
    inputType: InputType.SELECT,
    label: "TaskType",
    schema: z.enum(ServerTaskType),
    options: [
      { label: "Light", value: ServerTaskType.LIGHT },
      { label: "Normal", value: ServerTaskType.NORMAL },
      { label: "Heavy", value: ServerTaskType.HEAVY },
      { label: "Very Heavy", value: ServerTaskType.VERY_HEAVY }
    ],
  }
];
