import { useThemeColor } from "@/hooks/useThemeColor";
import Markdown, { MarkdownProps } from "react-native-markdown-display";

export default function MyMarkdown(props: MarkdownProps & {children: string}) {

    const textColor = useThemeColor("text")

    return (
        <Markdown
            style={{
                body: { color: textColor },
                image: {
                    maxWidth: 150,
                    maxHeight: 150
                },
            }}
            {...props}
        />
    )
}