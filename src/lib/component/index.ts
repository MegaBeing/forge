import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;
const componentDetailsSlice = createSlice({
  name: "ComponentDetails",
  initialState,
  reducers: {
    setComponent(state, action: PayloadAction<boolean>){
      return action.payload
    }
  }
})

export const { setComponent} = componentDetailsSlice.actions
export default componentDetailsSlice.reducer