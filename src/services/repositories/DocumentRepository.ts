// MINE SMART AI - Document Management Repository
import { DocumentItem, DocumentFilterOptions, DocumentStats, DocumentCategory } from "../../types/documentTypes";
import { mockDocuments, getInitialDocumentStats } from "../../data/mockDocumentData";

const STORAGE_KEY = "minesmart_document_repository_v1";

export class DocumentRepository {
  private static getDocumentsFromStorage(): DocumentItem[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDocuments));
      return mockDocuments;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return mockDocuments;
    }
  }

  private static saveDocumentsToStorage(docs: DocumentItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  }

  static async getAllDocuments(): Promise<DocumentItem[]> {
    return this.getDocumentsFromStorage();
  }

  static async getDocumentById(id: string): Promise<DocumentItem | undefined> {
    const docs = this.getDocumentsFromStorage();
    return docs.find((d) => d.id === id);
  }

  static async getDocumentStats(): Promise<DocumentStats> {
    const docs = this.getDocumentsFromStorage();
    return getInitialDocumentStats(docs);
  }

  static async filterDocuments(filter: DocumentFilterOptions): Promise<DocumentItem[]> {
    let docs = this.getDocumentsFromStorage();

    if (filter.category && filter.category !== "ALL") {
      docs = docs.filter((d) => d.category === filter.category);
    }

    if (filter.department && filter.department !== "ALL") {
      docs = docs.filter((d) => d.department === filter.department);
    }

    if (filter.status && filter.status !== "ALL") {
      docs = docs.filter((d) => d.status === filter.status);
    }

    if (filter.confidentiality && filter.confidentiality !== "ALL") {
      docs = docs.filter((d) => d.confidentiality === filter.confidentiality);
    }

    if (filter.equipmentTag) {
      const eqLower = filter.equipmentTag.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.equipmentTags?.some((e) => e.toLowerCase().includes(eqLower)) ||
          d.tags.some((t) => t.toLowerCase().includes(eqLower))
      );
    }

    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.documentNumber.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          (d.equipmentTags && d.equipmentTags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return docs;
  }

  static async createDocument(doc: Omit<DocumentItem, "id" | "createdAt" | "updatedAt" | "downloadCount">): Promise<DocumentItem> {
    const docs = this.getDocumentsFromStorage();
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    docs.unshift(newDoc);
    this.saveDocumentsToStorage(docs);
    return newDoc;
  }

  static async updateDocument(id: string, updates: Partial<DocumentItem>): Promise<DocumentItem | null> {
    const docs = this.getDocumentsFromStorage();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    docs[idx] = {
      ...docs[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveDocumentsToStorage(docs);
    return docs[idx];
  }

  static async incrementDownloadCount(id: string): Promise<number> {
    const docs = this.getDocumentsFromStorage();
    const doc = docs.find((d) => d.id === id);
    if (doc) {
      doc.downloadCount = (doc.downloadCount || 0) + 1;
      doc.lastAccessedAt = new Date().toISOString();
      this.saveDocumentsToStorage(docs);
      return doc.downloadCount;
    }
    return 0;
  }

  static async deleteDocument(id: string): Promise<boolean> {
    const docs = this.getDocumentsFromStorage();
    const filtered = docs.filter((d) => d.id !== id);
    if (filtered.length !== docs.length) {
      this.saveDocumentsToStorage(filtered);
      return true;
    }
    return false;
  }
}
