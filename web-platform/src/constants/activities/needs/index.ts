import {
  CreateShippingNeedFormData,
  CreateShoppingNeedFormData,
} from "@/validations/needs";

export const SHIPPING_SHOPPING_TABS = [
  {
    label: "Shipping",
    value: "shipping",
    icon: "delivery",
  },
  {
    label: "Shopping",
    value: "shopping",
    icon: "shopping-bag-remove",
  },
];

export const NEEDS_STATUSES = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "History",
    value: "history",
  },
];

export const LOAD_TYPE_SELECT_ITEMS = [
  {
    label: "Document",
    value: "DOCUMENT",
  },
  {
    label: "Cloth",
    value: "CLOTH",
  },
  {
    label: "Food",
    value: "FOOD",
  },
  {
    label: "Electronic Gadget",
    value: "ELECTRONIC_GADGET",
  },
  {
    label: "Other",
    value: "OTHER",
  },
] as const;

export const SHIPPING_FORM_INITIAL_VALUES = {
  productName: "",
  loadType: null,
  dimension: {
    isFlexible: false,
    weight: "",
    width: "",
    length: "",
    height: "",
    size: null,
    num: 1,
  },
  images: ["", null, null, null, null],
  origin: null,
  destination: null,
  proposedPrice: "",
  description: "",
  douDate: null,
} satisfies CreateShippingNeedFormData;

export const SHOPPING_FORM_INITIAL_VALUES = {
  ...SHIPPING_FORM_INITIAL_VALUES,
  productLink: "",
  productPrice: "",
} satisfies CreateShoppingNeedFormData;

export const DOCUMENT_TYPES = {
  ISO_216_Standard_Sizes: {
    A3: "42 cm x 29.7 cm",
    A4: "29.7 cm x 21 cm",
    A5: "21 cm x 14.8 cm",
  },
  North_American_Paper_Sizes: {
    LETTER: "27.94 cm x 21.59 cm",
    LEGAL: "35.56 cm x 21.59 cm",
    TABLOID: "43.18 cm x 27.94 cm",
  },
};
