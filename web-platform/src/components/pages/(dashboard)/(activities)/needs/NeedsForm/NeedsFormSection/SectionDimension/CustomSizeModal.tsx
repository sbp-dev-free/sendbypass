import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

import { Icon, Modal } from "@/components";

import { CustomSizeModalProps } from "./types";

interface ModifiedCustomSizeModalProps
  extends Omit<CustomSizeModalProps, "onSubmit"> {}

export const CustomSizeModal = ({
  open,
  onClose,
}: ModifiedCustomSizeModalProps) => {
  const { control, setValue, trigger } = useFormContext();

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid = await trigger(["dimension.width", "dimension.length"]);

    if (isValid) {
      setValue("dimension.size", "CUSTOM", {
        shouldValidate: true,
        shouldTouch: true,
      });

      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="md:w-[385px] rounded-medium p-16">
        <div className="flex justify-between mb-12">
          <div>
            <div className="text-on-surface text-title-medium">
              Add custom size
            </div>
            <div className="text-on-surface-variant text-body-small">
              Enter the length and width of your document.
            </div>
          </div>
          <IconButton
            color="tonal"
            className="!w-40 !h-40 rounded-full"
            onClick={onClose}
          >
            <Icon name="Close remove" className="text-[20px]" />
          </IconButton>
        </div>

        <form onSubmit={handleModalSubmit} className="space-y-12">
          <Controller
            name="dimension.width"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Width"
                className="text-on-surface-variant w-full"
                size="medium"
                error={!!error?.message}
                helperText={error?.message}
                autoComplete="off"
                type="number"
                InputProps={{
                  endAdornment: (
                    <span className="text-body-medium text-outline mr-2">
                      cm
                    </span>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="dimension.length"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Length"
                className="text-on-surface-variant w-full mb-12"
                size="medium"
                error={!!error?.message}
                helperText={error?.message}
                autoComplete="off"
                type="number"
                InputProps={{
                  endAdornment: (
                    <span className="text-body-medium text-outline mr-2">
                      cm
                    </span>
                  ),
                }}
              />
            )}
          />
          <div className="flex gap-x-12">
            <Button variant="tonal" onClick={onClose} className="w-full">
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
