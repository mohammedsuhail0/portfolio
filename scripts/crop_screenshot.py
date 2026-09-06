import os
import sys
from PIL import Image
import numpy as np

def clean_and_crop_screenshot(input_path, output_path):
    img = Image.open(input_path).convert('RGB')
    arr = np.array(img)
    h, w, _ = arr.shape

    # Detect top browser header (tabs, search bar, bookmarks)
    top_crop = 0
    for y in range(0, min(140, h)):
        row = arr[y]
        channel_diff = np.abs(row[:, 0].astype(int) - row[:, 1].astype(int)) + np.abs(row[:, 1].astype(int) - row[:, 2].astype(int))
        mean_r = row[:, 0].mean()
        is_gray_chrome = (channel_diff.mean() < 8) and (25 <= mean_r <= 245)
        if is_gray_chrome and y < 100:
            top_crop = y + 1

    top_crop = min(top_crop, 110)

    bottom_crop = h
    for y in range(h - 1, max(h - 80, 0), -1):
        row = arr[y]
        mean_r = row[:, 0].mean()
        channel_diff = np.abs(row[:, 0].astype(int) - row[:, 1].astype(int)) + np.abs(row[:, 1].astype(int) - row[:, 2].astype(int))
        if channel_diff.mean() < 8 and (25 <= mean_r <= 245) and (h - 1 - y) < 50:
            bottom_crop = y

    print(f'Original: {w}x{h} -> Cropping: Top={top_crop}, Bottom={bottom_crop}')
    cropped = img.crop((0, top_crop, w, bottom_crop))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cropped.save(output_path, quality=95)
    print(f'Saved cleanly to {output_path} ({cropped.size[0]}x{cropped.size[1]})')

if __name__ == '__main__':
    if len(sys.argv) > 2:
        clean_and_crop_screenshot(sys.argv[1], sys.argv[2])
