import os
import pickle

import faiss
import numpy as np

from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import Config


class EmbeddingService:

    def __init__(self):

        print("=" * 60)
        print("Initializing Embedding Service...")
        print("=" * 60)

        self.model = SentenceTransformer(
            Config.EMBEDDING_MODEL
        )

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=Config.CHUNK_SIZE,
            chunk_overlap=Config.CHUNK_OVERLAP,
        )

        self.index = None
        self.documents = []

        self.load()

    # ======================================================
    # Split PDF into chunks
    # ======================================================

    def split_document(self, text):

        chunks = self.splitter.split_text(text)

        print(f"Created {len(chunks)} chunks")

        return chunks

    # ======================================================
    # Create embeddings
    # ======================================================

    def create_embeddings(self, chunks):

        print("Creating embeddings...")

        embeddings = self.model.encode(
            chunks,
            convert_to_numpy=True,
            show_progress_bar=True
        )

        print("Embeddings created.")

        return embeddings.astype("float32")

    # ======================================================
    # Add document
    # ======================================================

    def add_document(self, text):

        print("\n========== INDEXING DOCUMENT ==========")

        chunks = self.split_document(text)

        vectors = self.create_embeddings(chunks)

        if self.index is None:

            dimension = vectors.shape[1]

            print("Creating new FAISS index")

            self.index = faiss.IndexFlatL2(dimension)

        else:

            print("Using existing FAISS index")

        self.index.add(vectors)

        self.documents.extend(chunks)

        print("Total chunks stored:", len(self.documents))

        self.save()

        print("Document indexed successfully.")

        print("=======================================\n")

    # ======================================================
    # Search
    # ======================================================

    def search(self, query, k=5):

        print("\n")
        print("=" * 60)
        print("SEARCH REQUEST")
        print("=" * 60)

        print("Question:")
        print(query)

        if self.index is None:

            print("FAISS index is None!")

            return []

        print("Total Stored Chunks:", len(self.documents))

        query_vector = self.model.encode(
            [query],
            convert_to_numpy=True
        ).astype("float32")

        distances, indices = self.index.search(
            query_vector,
            k
        )

        print("\nReturned Indices:")
        print(indices)

        print("\nDistances:")
        print(distances)

        results = []

        for idx in indices[0]:

            if idx == -1:
                continue

            if idx >= len(self.documents):
                continue

            print("\n-----------------------------")
            print("Chunk Index:", idx)
            print("-----------------------------")

            print(self.documents[idx][:500])

            results.append(self.documents[idx])

        print("\nReturned Chunks:", len(results))

        print("=" * 60)
        print()

        return results

    # ======================================================
    # Save FAISS
    # ======================================================

    def save(self):

        if self.index is None:
            return

        print("Saving FAISS index...")

        faiss.write_index(
            self.index,
            Config.FAISS_INDEX
        )

        with open(
            Config.METADATA_FILE,
            "wb"
        ) as f:

            pickle.dump(
                self.documents,
                f
            )

        print("Saved successfully.")

    # ======================================================
    # Load FAISS
    # ======================================================

    def load(self):

        print("Loading existing FAISS database...")

        if os.path.exists(Config.FAISS_INDEX):

            self.index = faiss.read_index(
                Config.FAISS_INDEX
            )

            print("FAISS index loaded.")

        else:

            print("No FAISS index found.")

        if os.path.exists(Config.METADATA_FILE):

            with open(
                Config.METADATA_FILE,
                "rb"
            ) as f:

                self.documents = pickle.load(f)

            print("Metadata loaded.")
            print("Stored Chunks:", len(self.documents))

        else:

            print("No metadata found.")

        print("=" * 60)