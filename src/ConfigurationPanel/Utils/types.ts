import { Option } from "@/Common/Select/types";
import { FieldValues, Path } from "react-hook-form";
import { InputType } from "@/Utils/types";
import { z } from "zod";

export interface INodeBaseConfiguration {
  color: string;
  label: string;
  icon: React.JSX.Element;
}

export enum ServerTaskType {
  // TODO: convert this to number as we need this for calculation
  LIGHT = "LIGHT",
  NORMAL = "NORMAL",
  HEAVY = "HEAVY",
  VERY_HEAVY = "VERY_HEAVY"
}

export interface IClientConfiguration { 
  requestTypeCombination: number;
  requestPerSecond: number;
}

export interface ILoadBalancerConfiguration {
  queueCapacity: number;
  rateLimit: number;
}

export interface ICacheConfiguration {
  ram: number;
  cpu: number;
  network: number;
  hitRate: number;
}

type ConfigurationKey<TFormValues extends FieldValues> = Extract<keyof TFormValues, Path<TFormValues>>;

export type ConfigurationSchemaShape<TFormValues extends FieldValues> = {
  [TKey in ConfigurationKey<TFormValues>]: z.ZodType<TFormValues[TKey], TFormValues[TKey]>;
}

export type ConfigurationType<TFormValues extends FieldValues> = {
  [TKey in ConfigurationKey<TFormValues>]: {
    key: TKey;
    label: string;
    inputType: InputType;
    schema: z.ZodType<TFormValues[TKey], TFormValues[TKey]>;
    options?: Option[];
    required?: boolean;
  }
}[ConfigurationKey<TFormValues>]
