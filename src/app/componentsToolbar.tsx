import { ServerToolbarComponent } from "../_components/server";

export const ComponentToolbar = () => {
  return (
    <div className="p-2 shadow-xl rounded-xl bg-slate-400">
      <div className="w-full h-full flex flex-row gap-x-1 opacity-100">
        <ServerToolbarComponent/>
      </div>
      
    </div>
  );
}