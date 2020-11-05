export function fileSize2Text(sizeNum) {
    if (sizeNum < 1024) {
        return sizeNum + 'B'
    }
    if (sizeNum < 1024 * 1024) {
        return (sizeNum / 1024).toFixed(0) + 'KB';
    }

    if (sizeNum < 1024 * 1024 * 1024) {
        return (sizeNum / 1024 / 1024).toFixed(0) + 'MB';
    }

    return (sizeNum / 1024 / 1024 / 1024).toFixed(2) + 'GB';
}