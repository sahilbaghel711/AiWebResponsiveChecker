chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === "buttonClicked") {
        const viewports = [
            { name: "Mobile", width: 375 },
            { name: "Tablet", width: 768 },
            { name: "Desktop", width: 1440 },
            { name: "Large Desktop", width: 1536 }
        ];

        const responses = [];

        for (const vp of viewports) {
            // Simulate viewport by faking body width
            document.body.style.width = vp.width + "px";

            // Extract simplified layout structure
            const summary = [];
            const elements = [...document.body.querySelectorAll('header, nav, main, section, article, footer, div, img, button, input')];

            elements.slice(0, 50).forEach(el => {
                const tag = el.tagName.toLowerCase();
                const classes = el.className ? `.${el.className.split(" ").join(".")}` : '';
                const bbox = el.getBoundingClientRect();
                const text = el.innerText.trim().replace(/\s+/g, ' ').slice(0, 60);

                summary.push(`${tag}${classes} - ${Math.round(bbox.width)}x${Math.round(bbox.height)} - "${text}"`);
            });

            const layoutSummary = summary.join("\n");

            const prompt = `
You are a mobile responsiveness expert. A page was viewed at ${vp.width}px width. Here's a simplified layout summary:\n\n${layoutSummary}\n\n
Identify any potential layout/responsiveness issues (like overflowing content, poor scaling, hidden elements). Suggest plain-English fixes with CSS ideas.
`;

            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer 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`,
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: "You are a layout assistant." },
                            { role: "user", content: prompt }
                        ],
                        max_tokens: 500,
                    }),
                });

                const data = await response.json();
                const result = data.choices?.[0]?.message?.content || "No response";
                console.log(`Response for ${vp.name}:`, result);
                responses.push(`🖥 ${vp.name}:\n${result}`);
            } catch (error) {
                responses.push(`❌ ${vp.name} Error: ${error.message}`);
            }
        }

        alert(responses.join("\n\n---\n\n"));
    }
});
