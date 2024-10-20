import { formatDocumentsAsString } from "langchain/util/document";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"; 
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Document } from "langchain/document";
import * as fs from 'fs';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatMessageHistory } from "langchain/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";

process.env.OPENAI_API_KEY = "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";
process.env.ATLAS_CONNECTION_STRING = "mongodb+srv://rogehbeshay258:DBxzyXuL7AqrmUYu@cluster0.cqeiv.mongodb.net/Cluster0";
const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

async function run() {
    try {

        console.log("hi");

        const database = client.db("Cluster0");
        const collection = database.collection("FhirDocumentation")
        const dbConfig = {
            collection: collection,
            indexName: "vector_index", // Specifies Atlas search index we are using
            textKey: "text", // Field name for the raw text content
            embeddingKey: "embedding"
        };

        const filePaths = [];

        for(let i = 1; i <= 16; i++) {
            filePaths.push(`Json Data/json${i}.json`);
        }

        const loadJSON = (filePath) => {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        };

        let allDocs = [];

        for(const filePath of filePaths) {
            const jsonData = loadJSON(filePath);

            const formatted = jsonData.map((entry) => new Document({
                pageContent: entry.text,
                metadata: {
                    source: entry.url
                }
            }));

            allDocs = allDocs.concat(formatted);
        }

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunk_size: 1000,
            chunkOverlap: 200
        });

        const docs = await textSplitter.splitDocuments(allDocs);

        const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(docs, new OpenAIEmbeddings(), dbConfig);

    } finally {
        await client.close();
    }
}

run().catch(console.dir);