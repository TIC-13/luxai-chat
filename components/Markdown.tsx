import { useThemeColor } from "@/hooks/useThemeColor";
import Markdown, { MarkdownProps } from "react-native-markdown-display";

export default function MyMarkdown(props: MarkdownProps & {children: string}) {

    const textColor = useThemeColor("text")
    const codeInlineColor = useThemeColor("codeInlineBackground")

    const textContentStyle = {flexDirection: 'row', flexWrap: 'wrap', lineHeight: 30}

    return (
        <Markdown
            style={{
                body: { fontSize: 15, color: textColor, fontFamily: 'Roboto' },
                text: {verticalAlign: 'middle'},
                image: {
                    maxWidth: 150,
                    maxHeight: 150,
                    marginBottom: -5
                },
                ordered_list: {flexDirection: 'column', flexWrap: 'wrap', width: "100%"},
                bullet_list: {flexDirection: 'column', flexWrap: 'wrap', width: "100%"},
                ordered_list_content: {flexDirection: 'row', flexWrap: 'wrap', lineHeight: 30},
                bullet_list_content: {flexDirection: 'row', flexWrap: 'wrap', lineHeight: 30},
                paragraph: {flexDirection: 'row', flexWrap: 'wrap', lineHeight: 30},
                textgroup: {flexDirection: 'row', flexWrap: 'wrap'},
                code_inline: { backgroundColor: codeInlineColor}
            }}
            //debugPrintTree={true}
            {...props}
        />
    )
}