import { ServerToolbarComponent } from "../_components/server";

export const ComponentToolbar = () => {
  return (
    <div className="p-2 shadow-lg rounded-xl bg-neutral-200 flex flex-row gap-x-1">
      <ServerToolbarComponent/>
      <ServerToolbarComponent/>
    </div>
  );
}