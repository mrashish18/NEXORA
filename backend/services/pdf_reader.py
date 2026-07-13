import os
import fitz  # PyMuPDF
from docx import Document


class PDFReader:
    """
    Reads PDF, DOCX and TXT files.
    """

    def __init__(self):
        pass

    # ---------------------------------------
    # Main Reader
    # ---------------------------------------

    def read(self, filepath: str) -> str:

        extension = os.path.splitext(filepath)[1].lower()

        if extension == ".pdf":
            return self.read_pdf(filepath)

        elif extension == ".docx":
            return self.read_docx(filepath)

        elif extension == ".txt":
            return self.read_txt(filepath)

        else:
            raise Exception(f"Unsupported file type: {extension}")

    # ---------------------------------------
    # PDF Reader
    # ---------------------------------------

    def read_pdf(self, filepath: str) -> str:

        text = ""

        with fitz.open(filepath) as pdf:

            for page in pdf:

                page_text = page.get_text("text")

                if page_text:
                    text += str(page_text) + "\n"

        return text

    # ---------------------------------------
    # DOCX Reader
    # ---------------------------------------

    def read_docx(self, filepath: str) -> str:

        document = Document(filepath)

        text = ""

        for para in document.paragraphs:

            if para.text:
                text += para.text + "\n"

        return text

    # ---------------------------------------
    # TXT Reader
    # ---------------------------------------

    def read_txt(self, filepath: str) -> str:

        with open(filepath, "r", encoding="utf-8") as file:
            return file.read()

    # ---------------------------------------
    # Clean Text
    # ---------------------------------------

    def clean_text(self, text: str) -> str:

        text = text.replace("\r", "")
        text = text.replace("\t", " ")

        while "  " in text:
            text = text.replace("  ", " ")

        while "\n\n\n" in text:
            text = text.replace("\n\n\n", "\n\n")

        return text.strip()

    # ---------------------------------------
    # Extract
    # ---------------------------------------

    def extract(self, filepath: str) -> str:

        text = self.read(filepath)

        return self.clean_text(text)