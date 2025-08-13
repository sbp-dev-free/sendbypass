export interface Breadcrumb {
  href: string;
  label: string;
  isCurrent: boolean;
}

export interface BreadcrumbsComponentProps {
  breadcrumbs: Breadcrumb[];
}
