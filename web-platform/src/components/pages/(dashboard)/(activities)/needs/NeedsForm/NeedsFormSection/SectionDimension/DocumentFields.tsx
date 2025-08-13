import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { useToggle } from "usehooks-ts";

import { Icon, NumberInputWithControls } from "@/components";
import { DOCUMENT_TYPES } from "@/constants/activities";
import { cn } from "@/utils";

import { CustomSizeModal } from "./CustomSizeModal";
import { SizeOption } from "./types";

export const DocumentFields = () => {
  const { control, watch, setValue } = useFormContext();

  const width = watch("dimension.width");
  const length = watch("dimension.length");

  const [openCustomSizeModal, toggleCustomSizeModal] = useToggle();

  const groupedOptions: SizeOption[] = [
    ...Object.entries(DOCUMENT_TYPES.ISO_216_Standard_Sizes).map(
      ([key, dimensions]) => ({
        value: key,
        label: key.toUpperCase(),
        dimensions: dimensions,
        category: "ISO 216 Standard Sizes",
      }),
    ),
    ...Object.entries(DOCUMENT_TYPES.North_American_Paper_Sizes).map(
      ([key, dimensions]) => ({
        value: key,
        label: key.toLowerCase(),
        dimensions: dimensions,
        category: "North American Paper Sizes",
      }),
    ),
  ];

  return (
    <>
      <Controller
        control={control}
        name="dimension.size"
        defaultValue={null}
        render={({ field, fieldState: { error } }) => {
          let autocompleteValue: SizeOption | null = null;
          if (field.value && field.value !== "CUSTOM") {
            autocompleteValue =
              groupedOptions.find((option) => option.value === field.value) ||
              null;
          } else if (field.value === "CUSTOM" && width && length) {
            autocompleteValue = {
              value: "CUSTOM",
              label: `Custom: ${width} x ${length}`,
              dimensions: `${width} x ${length}`,
              category: "Custom",
            };
          } else if (field.value === "CUSTOM") {
            autocompleteValue = {
              value: "CUSTOM",
              label: "Custom: ...",
              dimensions: "...",
              category: "Custom",
            };
          }
          return (
            <Autocomplete
              value={autocompleteValue}
              onChange={(_, newValue: SizeOption | null) => {
                const selectedValue = newValue ? newValue.value : null;
                field.onChange(selectedValue);
                if (selectedValue !== "CUSTOM") {
                  setValue("dimension.width", "", {
                    shouldValidate: false,
                    shouldDirty: false,
                  });
                  setValue("dimension.length", "", {
                    shouldValidate: false,
                    shouldDirty: false,
                  });
                }
              }}
              options={groupedOptions}
              groupBy={(option) => option.category}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, currentAutocompleteValue) =>
                option.value === currentAutocompleteValue?.value
              }
              renderOption={(props, option) => {
                const { key, ...restProps } = props;
                return (
                  <li
                    key={key}
                    {...restProps}
                    className={cn(
                      "p-0 transition-all duration-200 hover:!bg-primary-opacity-8 rounded-small cursor-pointer",
                      restProps.className,
                    )}
                  >
                    <div className="flex justify-between items-center w-full px-0 py-4">
                      <div className="text-on-surface text-label-large">
                        {option.label}
                      </div>
                      <div className="text-outline text-label-medium">
                        {option.dimensions}
                      </div>
                    </div>
                  </li>
                );
              }}
              renderGroup={(params) => {
                const { key, ...otherParams } = params;
                const showAddCustomButton =
                  params.group === "North American Paper Sizes" ||
                  (params.group === "ISO 216 Standard Sizes" &&
                    !groupedOptions.some(
                      (opt) => opt.category === "North American Paper Sizes",
                    ));

                return (
                  <li key={key} className="px-8" {...otherParams}>
                    <div className="text-label-medium text-outline mb-2">
                      {params.group}
                    </div>
                    <ul className={autocompleteClasses.listbox}>
                      {params.children}
                    </ul>
                    {showAddCustomButton && (
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="tonal"
                          className="w-full"
                          startIcon={<Icon name="plus" />}
                          onClick={toggleCustomSizeModal}
                        >
                          Add Custom Size
                        </Button>
                      </div>
                    )}
                  </li>
                );
              }}
              renderInput={(props) => (
                <TextField
                  {...props}
                  label="Document Type"
                  helperText={error?.message}
                  error={!!error?.message}
                  className="text-on-surface-variant"
                />
              )}
            />
          );
        }}
      />
      <NumberInputWithControls
        name="dimension.num"
        label="Number of paper"
        minValue={1}
        defaultValue={1}
      />

      <CustomSizeModal
        open={openCustomSizeModal}
        onClose={toggleCustomSizeModal}
      />
    </>
  );
};
