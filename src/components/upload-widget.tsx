import { useEffect, useRef, useState } from "react";
import { Trash, UploadCloud } from "lucide-react";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { Button } from "./ui/button";

const UploadWidget = ({
  value = null,
  onChange,
  disabled = false,
}: UploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null); // Use this to persist the widget accross renders
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setPreview(value);
    if (!value) setDeleteToken(null);
  }, [value]);

  useEffect(() => {
    // To always keep the latest onChange parameter
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "uploads",
          maxFileSize: 5_000_000,
          clientAllowedFormats: ["png", "jpg", "jpeg"],
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };

            setPreview(payload);
            // console.log(result);

            setDeleteToken(result.info.delete_token ?? null);
            onChangeRef.current?.(payload);
          }
        },
      );

      return true;
    };

    // The "initializeWidget" function once called either returns true or false
    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  const removeFromCloudinary = async () => {
    // Removes the uploaded image from cloudinary using the delete token
    if (!preview) return;

    setIsRemoving(true);

    // console.log("is about to remove", { deleteToken });

    try {
      if (deleteToken) {
        const params = new URLSearchParams();
        params.append("token", deleteToken);

        await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
          {
            method: "POST",
            body: params,
          },
        );
      }
    } catch (error) {
      console.error("Failed to remove image from Cloudinary", error);
    } finally {
      setPreview(null);
      setDeleteToken(null);
      onChangeRef.current?.(null);
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Uploaded file" />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={removeFromCloudinary}
            disabled={isRemoving || disabled}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to upload photo</p>
              <p>PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
