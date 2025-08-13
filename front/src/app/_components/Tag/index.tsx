import { FC } from 'react'


const colors: Record<Required<TagProps>['color'], string> = {
  success: 'green',
  processing: 'yellow',
  error: 'red',
  warning: 'orange',
  primary: 'violet',
  default: 'gray',
}

interface Shade {
  bg: number
  text: number
}

const shades: Record<Required<TagProps>['shade'], Shade> = {
  light: {
    text: 800,
    bg: 100,
  },
  normal: {
    text: 600,
    bg: 200,
  },
  semidark: {
    text: 200,
    bg: 600,
  },
  dark: {
    text: 100,
    bg: 800,
  },
}


interface TagProps {
  children: React.ReactNode
  color?: 'success' | 'processing' | 'error' | 'warning' | 'primary' | 'default'
  shade?: 'light' | 'normal' | 'semidark' | 'dark'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'
}

const Tag: FC<TagProps> = ({ children, color = 'primary', shade = 'normal', size = 'lg' }) => (
  <div
    className={
      `bg-${colors[color]}-${shades[shade].bg} text-${colors[color]}-${shades[shade].text} py-1 px-2 rounded-l-2xl rounded-r-2xl text-${size}`
    }
  >
    {children}
  </div>
)

export default Tag
