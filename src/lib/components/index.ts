import { ICanvasComponent } from '@/types/components'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidV4 } from 'uuid'

const initialState: ICanvasComponent[] = []

const componentSlice = createSlice({
  name: 'componentReducer',
  initialState,
  reducers: {
    addComponent(state, action: PayloadAction<ICanvasComponent>) {
      const key = uuidV4();
      const component: ICanvasComponent = {
        ...action.payload,
        key
      }
      state.push(component)
    },
    deleteComponent(state, action: PayloadAction<string>){
      state = state.filter(component => action.payload != component.key)
    },
    resetComponents(state){
      state = []
    }
  }
})

export const { addComponent, deleteComponent, resetComponents } = componentSlice.actions
export default componentSlice.reducer