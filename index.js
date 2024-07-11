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
    const { prompt } = req.body;

    // Make API call to OpenAI
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `${prompt}`, // Ensure 'prompt' is converted to string
      max_tokens: 15,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    });
    
    console.log("OpenAI Response:", response);
    return res.status(200).json({
        success: true,
        data: response,
      });


    // Check if response and choices are valid
    // if (response && response.data && response.data.choices && response.data.choices.length > 0) {
    //   const completion = response.data.choices[0];
    //   const messageContent = completion.choices[0].message.content
    //   console.log("Message Content:", messageContent);

    //   return res.status(200).json({
    //     success: true,
    //     data: response,
    //   });
    // } else {
    //   throw new Error("Empty or invalid response from OpenAI API");
    // }
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    res.status(400).json({
      success: false,
      error: error.response ? error.response.data : "There was an issue on the server. Please try again",
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
