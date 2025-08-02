// ai code for responsive design

import { Dimensions, PixelRatio, Platform } from "react-native";

// Design base dimensions (e.g., iPhone 11 screen size or any other design reference)
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// You can choose your own base dimensions depending on your design (e.g., 375x812 for iPhone 11)
const BASE_WIDTH = 412;
const BASE_HEIGHT = 917;

// Scale based on width
export const scaleWidth = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

// Scale based on height
export const scaleHeight = (size: number) =>
  (SCREEN_HEIGHT / BASE_HEIGHT) * size;

// Scale font size
export const scaleFont = (size: number) => {
  const newSize = scaleWidth(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Normalize size (a more balanced approach between width and height)
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scaleWidth(size) - size) * factor;
