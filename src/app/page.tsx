"use client";
import { ComponentToolbar } from "@/app/componentsToolbar";
import CanvasStage from "./canvas";
import { ToolBar } from "./_toolbar";
import { Provider } from "react-redux";
import store from "@/lib/store";

export default function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}

function Home() {
  return (
    <>
      <CanvasStage />
      {/* <div className="absolute top-1/3 right-0">
      <ToolBar />
    </div> */}
      <div className="absolute bottom-15 right-1/2 translate-x-1/2">
        <ComponentToolbar />
      </div>
    </>
  );
}
