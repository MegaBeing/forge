import { useEffect } from "react";
import { databaseConfigurationList } from "./Utils/constants";
import { getConfigurationList } from "../Components/getConfigurationList";
import { SubmitHandler, useForm } from "react-hook-form";
import { IDatabaseConfiguration } from "./Utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidationSchema } from "../Utils/constants";
import { ServerTaskType } from "../Utils/types";

interface IProps {
  data: IDatabaseConfiguration;
  onSubmit: (data: IDatabaseConfiguration) => void;
}

export const DEFAULT_DATABASE_CONFIGURATION: IDatabaseConfiguration = {
  ram: 1,
  cpu: 1,
  storage: 100,
  iops: 100,
}

export default function DatabaseConfigurationPanel({ data, onSubmit: onNodeSubmit }: IProps) {
  const validationSchema = getValidationSchema<IDatabaseConfiguration>(databaseConfigurationList)
  const { handleSubmit, control, reset } = useForm<IDatabaseConfiguration, unknown, IDatabaseConfiguration>({
    resolver: zodResolver(validationSchema),
    defaultValues: data
  });
  const { jsxElements } = getConfigurationList(databaseConfigurationList, control)

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const onSubmit: SubmitHandler<IDatabaseConfiguration> = (data) => {
    console.log(data)
    onNodeSubmit(data);
  }
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="font-['JetBrains_Mono',monospace] text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/40">
            Resources
          </p>
          <h3 className="mt-1 font-['JetBrains_Mono',monospace] text-base font-medium text-white">
            Database Configuration
          </h3>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {jsxElements}
        <button
          type="submit"
          className="mt-2 w-full rounded-xl border border-violet-300/40 bg-violet-400/20 px-4 py-2.5 font-['JetBrains_Mono',monospace] text-xs font-medium uppercase tracking-[0.14em] text-violet-100 shadow-[0_0_18px_rgba(108,99,255,0.18)] transition hover:border-violet-200/70 hover:bg-violet-400/30 focus:outline-none focus:ring-2 focus:ring-violet-300/40"
        >
          Apply Changes
        </button>
      </form>
    </section>
  )
}
