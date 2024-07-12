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
      const { prompt, style } = req.body;
  
      let systemMessage;
      if (style === 'professional') {
        systemMessage = "You are a professional writing assistant. Rewrite the following text to sound more professional. If there are grammatical errors, please correct them in the answer";
      } else if (style === 'casual') {
        systemMessage = "You are a Casual Bot. Rewrite the following text to sound more casual in a more humanly way.If there are grammatical errors, please correct them in the answer";
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid style provided. Use 'professional' or 'casual'."
        });
      }
  
      // Make API call to OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.7,
        frequency_penalty:0.4,
        presence_penalty: 0.4      });
  
      console.log("OpenAI Response:", response);
  
      // Check if response and choices are valid
      if (response?.data?.choices?.length > 0) {
        const messageContent = response.data.choices[0].message.content;
        console.log("Message Content:", messageContent);
  
        return res.status(200).json({
          success: true,
          data: response,
        });
      } else {
        return res.status(200).json({
            success: "kinda true",
            data: response,
          });
      }
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      res.status(400).json({
        success: false,
        error: error.message || "There was an issue on the server. Please try again",
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
