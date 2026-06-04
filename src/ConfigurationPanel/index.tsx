import Select from "@/Common/Select";
import IconColorSelector from "@/ConfigurationPanel/Components/IconSelector";
import EditableLabel from "@/ConfigurationPanel/Components/Label";
import { JSX, useEffect, useState } from "react";
import ServerConfigurationPanel, { DEFAULT_SERVER_CONFIGURATION } from "./ServerConfigurationPanel";
import { Controller, useForm } from "react-hook-form";
import { Node } from "@/Utils/types";
import { IServerConfiguration } from "./ServerConfigurationPanel/Utils/types";
import { ICacheConfiguration, IClientConfiguration, ILoadBalancerConfiguration, ServerTaskType } from "./Utils/types";
import { IDatabaseConfiguration } from "./DatabaseConfigurationPanel/Utils/types";
import DatabaseConfigurationPanel, { DEFAULT_DATABASE_CONFIGURATION } from "./DatabaseConfigurationPanel";

export enum ConfigurationPanelType {
  NONE = "NONE",
  SERVER = "SERVER",
  DATABASE = "DATABASE",
  CLIENT = "CLIENT",
  LOAD_BALANCER = "LOAD_BALANCER",
  CACHE = "CACHE",

}

export type PanelSelectType = {
  panelType: ConfigurationPanelType;
}
interface IProps {
  node: Node;
  updateNode: (node: Node) => void;
}

export type ConfigurationDataType = ICacheConfiguration | ILoadBalancerConfiguration | IClientConfiguration | IDatabaseConfiguration | IServerConfiguration;

export default function ConfigurationPanel({ node, updateNode }: IProps) {
  const { watch, control } = useForm<PanelSelectType>({
    defaultValues: {
      panelType: node.configuration.type || ConfigurationPanelType.NONE,
    }
  });
  const [panelType, setPanelType] = useState<ConfigurationPanelType | null>(node.configuration.type || ConfigurationPanelType.NONE);
  const createConfigurationPanelOptions = () => {
    return Object.values(ConfigurationPanelType).map((type) => ({
      label: type.replace("_", " "),
      value: type
    }));
  }

  const getServerTaskType = () => {
    const storedTaskType = node.configuration.data.taskType;
    if (typeof storedTaskType === "number") {
      return Object.values(ServerTaskType)[storedTaskType] ?? DEFAULT_SERVER_CONFIGURATION.taskType;
    }

    return DEFAULT_SERVER_CONFIGURATION.taskType;
  };

  const getPanelComponent = (panelType: ConfigurationPanelType | null) => {
    switch (panelType) {
      case ConfigurationPanelType.SERVER:
        const data = {
          ...DEFAULT_SERVER_CONFIGURATION,
          ram: node.configuration.data.ram ?? DEFAULT_SERVER_CONFIGURATION.ram,
          cpu: node.configuration.data.cpu ?? DEFAULT_SERVER_CONFIGURATION.cpu,
          storage: node.configuration.data.storage ?? DEFAULT_SERVER_CONFIGURATION.storage,
          network: node.configuration.data.network ?? DEFAULT_SERVER_CONFIGURATION.network,
          taskType: getServerTaskType(),
        }
        return <ServerConfigurationPanel data={data} onSubmit={(data: IServerConfiguration) => onSubmit(ConfigurationPanelType.SERVER, data)} />;
      case ConfigurationPanelType.DATABASE:
        const databaseData = {
          ram: node.configuration.data.ram ?? DEFAULT_SERVER_CONFIGURATION.ram,
          cpu: node.configuration.data.cpu ?? DEFAULT_SERVER_CONFIGURATION.cpu,
          storage: node.configuration.data.storage ?? DEFAULT_SERVER_CONFIGURATION.storage,
          iops: node.configuration.data.iops ?? DEFAULT_DATABASE_CONFIGURATION.iops,
        }
        return <DatabaseConfigurationPanel data={databaseData} onSubmit={(data: IDatabaseConfiguration) => onSubmit(ConfigurationPanelType.DATABASE, data)} />;
      // case ConfigurationPanelType.CLIENT:
      default:
        return <></>;
    }
  }
  const onSubmit = (panelType: ConfigurationPanelType, data: ConfigurationDataType) => {
    switch (panelType) {
      case ConfigurationPanelType.SERVER: {
        const serverData = data as IServerConfiguration;
        console.log("Server Configuration Data:", serverData);
        updateNode({
          ...node,
          configuration: {
            type: ConfigurationPanelType.SERVER,
            data: {
              ...node.configuration.data,
              ...serverData,
              taskType: Object.values(ServerTaskType).indexOf(serverData.taskType)
            }
          }
        })
        // handle server config
        break;
      }
      case ConfigurationPanelType.DATABASE: {
        const databaseData = data as IDatabaseConfiguration;
        console.log("Database Configuration Data:", databaseData);
        updateNode({
          ...node,
          configuration: {
            type: ConfigurationPanelType.SERVER,
            data: {
              ...node.configuration.data,
              ...databaseData
            }
          }
        })
        // handle database config
        break;
      }
      // ...other cases
      default:
        console.log("Form Data:", data);
    }
  };
  const watchedPanelType = watch("panelType");
  useEffect(() => {
    if (watchedPanelType) {
      setPanelType(watchedPanelType);
      updateNode({
        ...node,
        configuration: {
          ...node.configuration,
          type: watchedPanelType as ConfigurationPanelType,
        }
      })
    }
  }, [watchedPanelType]);

  const updateNodeIcon = (icon: JSX.Element) => {
    updateNode({
      ...node,
      icon,
    });
  };

  const updateNodeColor = (color: string, icon: JSX.Element) => {
    updateNode({
      ...node,
      icon,
      colors: {
        fill: `${color}33`,
        stroke: color,
      },
    });
  };

  const updateNodeLabel = (label: string) => {
    updateNode({
      ...node,
      label,
    });
  };

  return (
    <aside className="absolute inset-x-3 bottom-24 z-20 max-h-[min(34rem,calc(100vh-7rem))] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:top-4 sm:max-h-none sm:w-[min(22rem,calc(100vw-2rem))] lg:w-96">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e12]/90 shadow-[0_18px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="font-['JetBrains_Mono',monospace] text-[0.65rem] font-medium uppercase tracking-[0.18em] text-violet-300">
            Configure
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <EditableLabel
              value={node.label}
              fallback="Component"
              className="truncate font-['JetBrains_Mono',monospace] text-lg font-medium text-white"
              onChange={updateNodeLabel}
            />
            <IconColorSelector
              icon={node.icon}
              color={node.colors.stroke}
              variant="icon"
              onIconChange={updateNodeIcon}
              onColorChange={updateNodeColor}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Controller
              control={control}
              name="panelType"
              render={({ field }) => (
                <Select
                  options={createConfigurationPanelOptions()}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Component Type"
                />
              )}
            />
          </div>
          {getPanelComponent(panelType)}
        </div>
      </div>
    </aside>
  )
}
