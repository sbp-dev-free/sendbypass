export interface TitleWrapperProps {
  title: string | React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
  extraRender?: React.ReactNode;
}
