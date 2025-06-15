/* 
- **Text Tool**: Add written content directly onto the canvas.
- **Pencil Tool**: Freehand drawing or marking areas of interest.
- **Eraser Tool**: Remove unwanted elements or mistakes.
- **Shapes Tool**: Draw standard shapes like rectangles, circles, etc.
- **Arrow Tool**: Create visual connections between elements.
*/ 

import CursorIcon from '/assets/toolbar/mouse-pointer.svg';
import PencilIcon from '/assets/toolbar/pencil.svg';
import EraserIcon from '/assets/toolbar/eraser.svg';
import TextIcon from '/assets/toolbar/text.svg';      
import RectangleIcon from '/assets/toolbar/rectangle.svg';
import CircleIcon from '/assets/toolbar/circle.svg';  

export const TOOLBAR_ITEMS = [
    {
        label: 'Arrow',
        icon: CursorIcon
    },
    {
        label: 'Pencil',
        icon: PencilIcon
    },
    {
        label: 'Eraser',
        icon: EraserIcon
    },
    {
        label: 'Text',
        icon: TextIcon
    },
    {
        label: 'Rectangle',
        icon: RectangleIcon
    },
    {
        label: 'Circle',
        icon: CircleIcon
    }
]