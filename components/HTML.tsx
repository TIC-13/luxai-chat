import { useThemeColor } from "@/hooks/useThemeColor";
import { useMemo } from "react";
import AutoHeightWebView from 'react-native-autoheight-webview';

export default function MyHTML(props: { children: string }) {

    const { children } = props

    const textColor = useThemeColor("text")

    const htmlParsed = useMemo(() => parseHTMLToDocument(children, textColor), [children])

    return (
        <AutoHeightWebView
            style={{ backgroundColor: 'transparent', width: "100%", marginBottom: 10}}
            originWhitelist={['*']}
            source={{ html: htmlParsed}}
            scrollEnabled={false}
            injectedJavaScript="document.body.style.overflow = 'hidden';"
            javaScriptEnabled={true}
            injectedJavaScriptBeforeContentLoaded="document.body.style.overflow = 'hidden';"
            onSizeUpdated={size => console.log(size.height)}
        />
    )
}

function parseHTMLToDocument(html: string, textColor: string) {
   
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
            color: ${textColor}
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }

        p {
            margin-bottom: 10px;
            font-size: clamp(18px, 4vw, 24px);
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        /* Tablet styles */
        @media screen and (max-width: 768px) {
            body {
                padding: 15px;
                max-width: 100%;
            }
            
            h1 {
                font-size: clamp(18px, 5vw, 28px);
            }
            
        }
        
        /* Mobile styles */
        @media screen and (max-width: 480px) {
            body {
                padding: 10px;
            }
            
            h1 {
                font-size: clamp(16px, 6vw, 24px);
                padding-bottom: 8px;
            }
            
            li {
                font-size: clamp(16px, 5vw, 20px);
                margin-bottom: 6px;
            }
            
            p {
                font-size: clamp(16px, 5vw, 20px);
                margin-bottom: 8px;
            }
            
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`
}