import DefaultToolIcon from "/tools/default.svg"
interface IProps{
  color: string;
  activeColor: string;
  icon: string;
  activeIcon: string;
  onClick(): void
  onHover(): void
  onDragStart(): void
  onDrag(): void
  onDrop(): void
}

export const Tool = ({
  color,
  activeColor,
  icon,
  activeIcon,
  onClick,
  onHover,
  onDragStart,
  onDrag,
  onDrop
}: IProps) => {
  return (
    <div>
      
    </div>
  )
}