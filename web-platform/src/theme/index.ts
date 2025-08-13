"use client";

import { createTheme } from "@mui/material/styles";

import { MuiAccordion } from "./MuiAccordion";
import { MuiAccordionDetails } from "./MuiAccordionDetails";
import { MuiAccordionSummary } from "./MuiAccordionSummary";
import { MuiAutocomplete } from "./MuiAutocomplete";
import { MuiBadge } from "./MuiBadge";
import { MuiButton } from "./MuiButton";
import { MuiCheckbox } from "./MuiCheckbox";
import { MuiChip } from "./MuiChip";
import { MuiCircularProgress } from "./MuiCircularProgress";
import { MuiContainer } from "./MuiContainer";
import { MuiDialog } from "./MuiDialog";
import { MuiDivider } from "./MuiDivider";
import { MuiDrawer } from "./MuiDrawer";
import { MuiIconButton } from "./MuiIconButton";
import { MuiLinearProgress } from "./MuiLinearProgress";
import { MuiList } from "./MuiList";
import { MuiRadio } from "./MuiRadio";
import { MuiRating } from "./MuiRating";
import { MuiSelect } from "./MuiSelect";
import { MuiSkeleton } from "./MuiSkeleton";
import { MuiSlider } from "./MuiSlider";
import { MuiSwitch } from "./MuiSwitch";
import { MuiTextField } from "./MuiTextField";

export const theme = createTheme({
  components: {
    MuiBadge,
    MuiButton,
    MuiCheckbox,
    MuiChip,
    MuiDivider,
    MuiLinearProgress,
    MuiCircularProgress,
    MuiRadio,
    MuiSwitch,
    MuiTextField,
    MuiContainer,
    MuiIconButton,
    MuiAutocomplete,
    MuiSelect,
    MuiList,
    MuiDrawer,
    MuiDialog,
    MuiSlider,
    MuiRating,
    MuiSkeleton,
    MuiAccordion,
    MuiAccordionSummary,
    MuiAccordionDetails,
  },
});
