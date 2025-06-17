import { Colors as LuxAIColors } from "./colors/LuxAIChat";
import { MotorolaColors } from "./colors/MotorolaChat";

const Colors = process.env.EXPO_PUBLIC_APP === "RAZR_40" ? MotorolaColors : LuxAIColors;

export { Colors };

