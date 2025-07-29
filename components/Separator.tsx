import { useThemeColor } from "@/hooks/useThemeColor";
import { View, ViewProps } from "react-native";

export default function Separator({props}: { props?: ViewProps}) {

    const separatorColor = useThemeColor("separator");

    return (
        <View
            {...props}
            style={[
                { width: "100%", borderTopWidth: 3, borderColor: separatorColor, marginVertical: 20 },
                props?.style
            ]}
        />
    )
}