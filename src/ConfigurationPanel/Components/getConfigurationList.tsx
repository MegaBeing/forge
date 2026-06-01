import Select from "@/Common/Select"
import Slider from "@/Common/Slider"
import Switch from "@/Common/Switch"
import { TextInput } from "@/Common/TextInput"
import { InputType } from "@/Utils/types"
import { ConfigurationType } from "../Utils/types"
import { Control, Controller, FieldValues } from "react-hook-form"

export const getConfigurationList = <TFormValues extends FieldValues>(
  configurationList: ConfigurationType<TFormValues>[],
  control: Control<TFormValues>
) => {

  const jsxElements = configurationList.map((element) => {
    if (element.key === "icon" || element.key === "color") {
      return null;
    }

    switch (element.inputType) {
      case InputType.SELECT:
        return <Controller
          key={`select-${element.key}`}
          control={control}
          name={element.key}
          render={({ field }) => (
            <Select
              options={element.options}
              label={element.label}
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />

      case InputType.SLIDER:
        return <Controller
          key={`Slider-${element.key}`}
          control={control}
          name={element.key}
          render={({ field }) => (
            <Slider
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      case InputType.SWITCH:
        return <Controller
          key={`Switch-${element.key}`}
          control={control}
          name={element.key}
          render={({ field }) => (
            <Switch
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      case InputType.TEXT:
        return <Controller
          key={`TextInput-${element.key}`}
          control={control}
          name={element.key}
          render={({ field }) => (
            <TextInput
              label={element.label}
              value={field.value}
              onChange={(value: string) => field.onChange(value)}
            />
          )}
        />
      default: return <></>
    }
  })
  return { jsxElements }
}
