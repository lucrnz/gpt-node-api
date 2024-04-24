## GPT Node API

This is a draft project to integrate generative AI into my projects without using third-party services.

For knowing where to download models checkout this url:

## Requirements

- [Node](https://nodejs.org/en)

- [pnpm package manager](https://pnpm.io/)

- Check requirements for the [gpt4all](https://www.npmjs.com/package/gpt4all) package

## How to use

Download the model json config:

```sh
curl -L https://gpt4all.io/models/models3.json -o ./models3.json
```

Download a model:

- To download a model open the JSON file, search for the desired model and follow the link found in the "url" part.

Setup environment variables:

```sh
GPT_MODEL_CONFIG_FILEPATH=./models3.json
GPT_MODEL_FILEPATH=./orca-mini-3b-gguf2-q4_0.gguf
GPT_RUN_DEVICE=cpu
```

Install dependencies:

```sh
pnpm run install
```

Run the development server:

```sh
pnpm run dev
```

Usage:

```sh
curl --request POST \
  --url http://localhost:3000/complete \
  --data '{
  "prompt": "What is generative AI?"
}'
```

Response *(using orca-mini-3b)*
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": " Generative AI, also known as \"GAN\" (Generative Adversarial Network) AI, is a type of machine learning that involves training two neural networks - one to generate new data, and another to classify that data - together. The goal of GAN AI is to create realistic data that can be used for training the neural networks. This technology is often used in image and video synthesis, but it can also be applied to other domains such as text generation, speech synthesis, and more."
      }
    }
  ]
}
```

## Fair warning

I wrote this program to give an easy example on how to include generative AI.

I do not have the intention to give support/accept pull requests and/or respond to issues.

You are on your own, specially if you use this code on production.
