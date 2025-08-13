import { ReactNode } from "react";

export interface TermItemProps {
  id: string;
  number: number;
  title: string;
  content: string | ReactNode;
}
