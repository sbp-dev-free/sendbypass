import z from 'zod';
import SelectOptions from './selectOption';

const RequirementPayloadTypeEnum = z.enum([
  'DOCUMENT',
  'CLOTH',
  'FOOD',
  'ELECTRONIC_GADGET',
  'OTHER',
]);

export const requirementPayloadTypeSelectOptions: SelectOptions = [
  { value: RequirementPayloadTypeEnum.enum.DOCUMENT, label: 'Document' },
  { value: RequirementPayloadTypeEnum.enum.CLOTH, label: 'Cloth' },
  { value: RequirementPayloadTypeEnum.enum.FOOD, label: 'Food' },
  {
    value: RequirementPayloadTypeEnum.enum.ELECTRONIC_GADGET,
    label: 'Electronic Gadget',
  },
  { value: RequirementPayloadTypeEnum.enum.OTHER, label: 'Other' },
];

export default RequirementPayloadTypeEnum;
