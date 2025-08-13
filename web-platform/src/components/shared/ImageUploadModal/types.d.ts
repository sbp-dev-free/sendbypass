export interface ImageUploadModalProps {
  open: boolean;
  image: File | string | null;
  onClose: () => void;
  onSave: (file: File) => void;
  aspectRatio?: number;
}
