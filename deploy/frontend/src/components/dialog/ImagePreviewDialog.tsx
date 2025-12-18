import { FC } from 'react';
import CustomDialog from '@/components/dialog/dialog-props';

type ImagePreviewDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    userName: string;
};

const ImagePreviewDialog: FC<ImagePreviewDialogProps> = ({
    isOpen,
    onClose,
    imageUrl,
    userName,
}) => {
    return (
        <CustomDialog
            title={`${userName}`}
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <div className="flex justify-center items-center p-4">
                <img
                    src={imageUrl}
                    alt={userName}
                    className="max-w-full max-h-[70vh] rounded shadow-lg object-contain"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
            </div>
        </CustomDialog>
    );
};

export default ImagePreviewDialog;
