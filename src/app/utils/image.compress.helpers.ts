export class ImageCompressHelpers {

    private static MAX_WIDTH = 2048;
    private static MAX_HEIGHT = 2048;
    private static MIME_TYPE = "image/jpeg";
    private static QUALITY = 0.7;

    static async compressImage(file: File){
        const self = this;
        return new Promise<Blob | null>((resolve, reject) => {
            const blobURL = URL.createObjectURL(file);
            const img = new Image();
            img.src = blobURL;
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                reject("Cannot load image");
            };
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                const [newWidth, newHeight] = self.calculateSize(img, self.MAX_WIDTH, self.MAX_HEIGHT);
                const canvas = document.createElement("canvas");
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext("2d");
                ctx!.drawImage(img, 0, 0, newWidth, newHeight);
                canvas.toBlob((blob) => {
                    self.displayInfo('Original file', file);
                    self.displayInfo('Compressed file', blob);
                    resolve(blob);
                }, self.MIME_TYPE, self.QUALITY);
            }
            
        });
    }

    private static calculateSize(img: any, maxWidth: number, maxHeight: number) {
        let width = img.width;
        let height = img.height;
        if (width > height) {
            if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
            }
        }
        return [width, height];
    }

    private static displayInfo(label: string, file: File | Blob| null) {
        if(!file){
            return;
        }
        const imageInfo = `${label} - ${this.readableBytes(file.size)}`;
        console.log(imageInfo);
        return imageInfo;
    }

    private static readableBytes(bytes: number) {
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }
}



    