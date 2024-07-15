const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/chathelper', async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    let systemMessage;
    if (mode === "professional") {
        systemMessage =
            "You are a professional writing assistant. Rewrite the following text to sound more professional. If there are grammatical errors, please correct them in the answer";
    } else if (mode === "casual") {
        systemMessage =
            "You are a Casual Bot. Rewrite the following text to sound more casual in a more humanly way.If there are grammatical errors, please correct them in the answer";
    } else if (mode === "meheryqa") {
        systemMessage =
            "You are a Conversational Chat Bot,The text u recieve is a customer asking you something regarding the companu you must respond in a bot way. This is what the company does from this link 'https://www.mehery.com/' understand it and respond accordingly. If there are grammatical errors, please correct them in the answer";
    } else if (mode === "doubt") {
        systemMessage = "Act as chat gpt bot and respond.";
    } else if (mode === "keywords") {
        systemMessage =
            "Take all the keywords mentioned in the message and return only those. if a date is added return it in DD/MM/YYYY format if year isnt given asssume current year-2024";
    } else {
        return res.status(400).json({
            success: false,
            error: "Invalid mode provided. Use 'professional' or 'casual'."
        });
    }

    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
        frequency_penalty: 0.4,
        presence_penalty: 0.4
    });

    console.log("OpenAI Response:", response);

    // Check if response and choices are valid
    if (response?.data?.choices?.length > 0) {
        const messageContent = response.data.choices[0].message.content;
        console.log("Message Content:", messageContent);

        return res.status(200).json({
            success: true,
            data: response
        });
    } else {
        return res.status(200).json({
            success: true,
            data: response
        });
    }
} catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    res.status(400).json({
        success: false,
        error: error.message || "There was an issue on the server. Please try again"
    });
}
  });
  
  



// app.post('/chathelper', async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     // Make API call to OpenAI
//     const response = await openai.completions.create({
//       model: "gpt-3.5-turbo-instruct",
//       prompt: `${prompt}`, // Ensure 'prompt' is converted to string
//       max_tokens: 20,
//       temperature: 0.3,
//       top_p: 1.0,
//       frequency_penalty: 0.4,
//       presence_penalty: 0.4,
//       stop: ["\n"],
//     });
    
//     console.log("OpenAI Response:", response);
//     // return res.status(200).json({
//     //     success: true,
//     //     data: response,
//     //   });


//     // Check if response and choices are valid
//     if (response?.data?.choices?.length > 0) {
//         const completion = response.data.choices[0];
//       const messageContent = completion.choices[0].message.content
//       console.log("Message Content:", messageContent);

//       return res.status(200).json({
//         success: true,
//         data: response,
//       });
//     } else {
//         return res.status(200).json({
//             success: true,
//             data: response,
//           });
//     }
//   } catch (error) {
//     console.error("Error fetching response from OpenAI:", error);
//     res.status(400).json({
//       success: false,
//       error: error.response ? error.response.data : "There was an issue on the server. Please try again",
//     });
//   }
// });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
