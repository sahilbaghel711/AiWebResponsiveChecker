chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === "buttonClicked") {
      const screenshot = request.screenshot; // base64 image from popup.js
  
      const viewports = [
        { name: "Mobile", width: 375 },
        { name: "Tablet", width: 768 },
        { name: "Desktop", width: 1440 },
        { name: "Large Desktop", width: 1536 },
      ];
  
      const responses = [];
  
      for (const vp of viewports) {
        // Fake page width using inline style
        document.body.style.width = vp.width + "px";
  
        // Layout summary extraction
        const elements = [...document.body.querySelectorAll(
          "header, nav, main, section, article, footer, div, img, button, input"
        )];
  
        const summary = elements.slice(0, 50).map((el) => {
          const tag = el.tagName.toLowerCase();
          const classes = el.className ? `.${el.className.split(" ").join(".")}` : "";
          const bbox = el.getBoundingClientRect();
          const text = el.innerText.trim().replace(/\s+/g, " ").slice(0, 60);
          return `${tag}${classes} - ${Math.round(bbox.width)}x${Math.round(bbox.height)} - "${text}"`;
        });
  
        const layoutSummary = summary.join("\n");
  
        const requestBody = {
          model: "gpt-4.1-nano",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You're a responsive layout expert.
  
  This webpage was viewed at ${vp.width}px width (${vp.name} view).
  
  Here is the simplified layout summary:\n${layoutSummary}
  
  Below is a screenshot of the page at this size. Identify any responsiveness issues (like overlapping content, poor scaling, or hidden elements). Recommend CSS fixes in plain English.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: screenshot // base64 image from popup
                  }
                }
              ]
            }
          ],
          max_tokens: 800
        };
  
        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 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` // Replace with your real key
            },
            body: JSON.stringify(requestBody)
          });
  
          const data = await response.json();
          const result = data.choices?.[0]?.message?.content || "No response";
          console.log(`Response for ${vp.name}:`, result);
          responses.push(`🖥 ${vp.name}:\n${result}`);
        } catch (error) {
          console.error(error);
          responses.push(`❌ ${vp.name} Error: ${error.message}`);
        }
      }
  
      alert(responses.join("\n\n---\n\n"));
    }
  });
  