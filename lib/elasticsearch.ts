"use server";

import axios from "axios";
import { ELASTICSEARCH_INDEX, ELASTICSEARCH_URL } from "./constants";
import { Document, IDocument } from "@/app/documents/columns";

export async function searchDocuments(query:string): Promise<Document[]> {
    // Get data from elastic search
    const payload = query ? {
      query: {
        // fuzzy match in title, description and content
        multi_match: {
          query,
          fields: ["title", "description", "content"],
          fuzziness: "AUTO"
        }
      }
    } : {
      query: {
        match_all: {}
      }
    }
    const data = await axios.get(`${ELASTICSEARCH_URL}/${ELASTICSEARCH_INDEX}/_search`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })
    return data.data.hits.hits.map((hit: any) => ({
      ...hit._source,
      id: hit._id,
      score: hit._score
    }))
  }

  export async function addDocument(document: IDocument): Promise<any> {
    const data = await axios.post(`${ELASTICSEARCH_URL}/${ELASTICSEARCH_INDEX}/_doc`, document, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return data.data
  }

  export async function deleteDocument(id: string): Promise<any> {
    const data = await axios.delete(`${ELASTICSEARCH_URL}/${ELASTICSEARCH_INDEX}/_doc/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
        })
    return data.data
  }