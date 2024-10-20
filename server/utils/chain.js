import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function initChain() {

    const collection = mongoose.connection.collection(process.env.MONGO_ATLAS_COLLECTION);

    if(!collection) {
        throw new Error("Missing Collection in Environment Variables");
    }

    const vectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings({}), {
        collection,
        indexName: process.env.MONGO_INDEX,
        textKey: "text",
        embeddingKey: "embedding"
    });

    const retriever = vectorStore.asRetriever();

    // const retrievedResults = await retriever._getRelevantDocuments("How do I create an FHIR object for resource type Condition?");
    // const documents = retrievedResults.map((documents => ({
    //     pageContent: documents.pageContent,
    //     pageNumber: documents.metadata.loc.pageNumber,
    //   })));
    // console.log(JSON.stringify(documents));

    return retriever;

}

export const retrieverPromise = initChain();
