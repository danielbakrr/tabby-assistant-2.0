``` 
This file contains the functions necessary for performing 
multi modal content generation for providing helpful study 
guides and research in helping the student to understand 
a particular technical or abstract concept 


```

import { GoogleGenAI, Modality } from "@google/genai";
const systemPromptImages = 
```
    You are an AI study asistant, given a user prompt describing a technical or abstract concept, generate a set of labeled, informative images that help explain the concept visually.
    Each image generated should be encoded in base 64 format and contain a helpful set of labels and arrows representing flowcharts where applicable. 
    Contain labels, arrows, and simple diagrams or flowcharts where applicable. Where possible maintain educational and professional tone (suitable for presentations, documentation and study notes).
```

const systemPromptWeb = 
```
You are an AI study asistant, given a user prompt describing a technical or abstract concept, generate a list of relevant 
websites that provides resources, documentation or research papers explaining the given concept. Each website link must 
be accompanied by a site logo prefably a company logo if it exists and the website label which is the name of the website
```

const callImageGen = async(prompt) => {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
            systemInstruction: systemPromptImages,
            'response_schema': {
                type: Type.ARRAY,
                description: "A list of Base64-encoded png images and its corresonding descriptions of the image",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        encodedImage:{
                            type: Type.STRING
                        },
                        description: {
                            type:Type.STRING
                        },
                        contentMimeType:{
                            type: Type.STRING,
                            enum: ["Base64"]
                        }
                    }
                }
            }
        },
         
    });

    parseResponse("image",response);

}

const generateRelatedWebSources = async(prompt) => {
    const groundingTool = {
        googleSearch: {},
      };
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: systemPromptWeb,
            tools: [groundingTool],
            responseSchema: {
                type: Type.Array,
                description: "List of relevant websites URL links with the siteLabel as the website name and the image as the website logo in Base64 format",
                items:{
                    link: {
                        type: Type.STRING
                    },
                    siteLabel: {
                        type: Type.STRING
                    }
                }
            }
        }
    })
    parseResponse("web",response)
}

// parse response and display on UI 
const parseResponse = (promptInfo,response) => {
    switch(promptInfo){

       case "image":{
         // parse the image response 
         if(typeof(response) == Array){
            const parentElement = document.getElementById("image-response-container");
            response.map((content,ind)=> {
                // populate html element 
                const childElement = document.createElement("div");
                // read the buffered image to display 
                const imgEle = document.createElement("img");
                childElement.id = `generatedImage-${ind}`
                imgEle.src = `data:image/png;base64,${content["encodedImg"]}`
                childElement.appendChild(imgEle);
                parentElement.appendChild(childElement);
            })
         }
       }

       case "website": {
        // parse the website response 
       }

       default: {
        // summarize content retrieved 
       }
    }
}