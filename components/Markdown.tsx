import { useThemeColor } from "@/hooks/useThemeColor";
import Markdown, { MarkdownProps } from "react-native-markdown-display";

export default function MyMarkdown(props: MarkdownProps & {children: string}) {

    const textColor = useThemeColor("text")

    return (
        <Markdown
            style={{
                body: { fontSize: 15, color: textColor, fontFamily: 'Roboto' },
                //text: {fontFamily: 'Roboto', flexDirection: 'row', flexWrap: 'wrap'},
                image: {
                    maxWidth: 150,
                    maxHeight: 150
                },
                ordered_list: {flexDirection: 'column', flexWrap: 'wrap', width: "100%"},
                ordered_list_content: {flexDirection: 'row', flexWrap: 'wrap'},
                bullet_list: {flexDirection: 'column', flexWrap: 'wrap', width: "100%"},
                bullet_list_content: {flexDirection: 'row', flexWrap: 'wrap'},
                paragraph: {flexDirection: 'row', flexWrap: 'wrap'},
                textgroup: {flexDirection: 'row', flexWrap: 'wrap'},
            }}
            debugPrintTree={true}
            {...props}
        />
    )
}