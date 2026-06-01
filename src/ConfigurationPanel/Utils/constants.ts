import { InputType } from "@/Utils/types";
import { isValidElement } from "react";
import { z } from "zod";
import { ConfigurationSchemaShape, ConfigurationType, INodeBaseConfiguration } from "./types";
import { FieldValues } from "react-hook-form";

export const commonConfiguration: ConfigurationType<INodeBaseConfiguration>[] = [
  {
    key: 'icon',
    label: "Icon",
    inputType: InputType.SELECT,
    schema: z.custom<React.JSX.Element>(
      (val) => {
        return isValidElement(val);
      },
      {
        message: "Invalid input: Expected a valid JSX element or React component.",
      }
    ),
    // options: [], // TODO: Add lucide icons
  },
  {
    key: 'color',
    label: "Color",
    inputType: InputType.SELECT,
    schema: z.string(),
    // options: [
      
    // ] // TODO: ADD hex codes
  },
  {
    key: 'label',
    label: "Label",
    schema: z.string(),
    inputType: InputType.TEXT,
  }
]

export function getValidationSchema<TFormValues extends FieldValues>(configurationList: ConfigurationType<TFormValues>[]) {
  const schemaObject = configurationList.reduce(
    (shape, field) => ({
      ...shape,
      [field.key]: field.schema,
    }),
    {} as Partial<ConfigurationSchemaShape<TFormValues>>
  );

  const formSchema = z.object(schemaObject as ConfigurationSchemaShape<TFormValues>);
  return formSchema;
}
