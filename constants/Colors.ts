import { Colors as LuxAIColors } from "./colors/LuxAIChat";
import { MotorolaColors } from "./colors/MotorolaChat";

const Colors = process.env.EXPO_PUBLIC_APP === "MOTOROLA" ? MotorolaColors : LuxAIColors;

export { Colors };

