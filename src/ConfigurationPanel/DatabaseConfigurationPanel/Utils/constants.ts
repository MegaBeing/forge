import { InputType } from "@/Utils/types";
import { ConfigurationType, ServerTaskType } from "../../Utils/types";
import { z } from "zod";
import { IDatabaseConfiguration } from "./types";


export const databaseConfigurationList: ConfigurationType<IDatabaseConfiguration>[] = [
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
    key: "iops",
    inputType: InputType.SELECT,
    label: "IOPS",
    schema: z.number(),
    options: [
      { label: "100 IOPS", value: 100 },
      { label: "200 IOPS", value: 200 },
      { label: "400 IOPS", value: 400 },
      { label: "800 IOPS", value: 800 },
    ],
  },
];
