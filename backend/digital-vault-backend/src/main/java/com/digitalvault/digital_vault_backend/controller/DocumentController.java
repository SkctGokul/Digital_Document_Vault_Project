package com.digitalvault.digital_vault_backend.controller;

import com.digitalvault.digital_vault_backend.model.Document;
import com.digitalvault.digital_vault_backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // ✅ Upload document (Multipart)
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId,
            @RequestParam("category") String category,
            @RequestParam(value = "description", required = false) String description) throws IOException {

        Document document = documentService.uploadDocument(file, userId, category, description);
        return ResponseEntity.ok(document);
    }

    // ✅ Get document by ID
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    // ✅ Get all documents (for admin)
    @GetMapping("/admin/all")
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    // ✅ Get admin document statistics
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getDocumentStats() {
        List<Document> allDocuments = documentService.getAllDocuments();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDocuments", allDocuments.size());
        stats.put("totalSize", allDocuments.stream()
            .mapToLong(doc -> doc.getFileData() != null ? doc.getFileData().length : 0)
            .sum());
        
        return ResponseEntity.ok(stats);
    }

    // ✅ Get all documents by userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Document>> getAllDocumentsByUserId(@PathVariable Long userId) {
        List<Document> documents = documentService.getAllDocumentsByUserId(userId);
        return ResponseEntity.ok(documents);
    }

    // ✅ Get documents by userId and category
    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<Document>> getDocumentsByCategory(
            @PathVariable Long userId,
            @PathVariable String category) {
        List<Document> documents = documentService.getDocumentsByUserIdAndCategory(userId, category);
        return ResponseEntity.ok(documents);
    }

    // ✅ Search documents by file name
    @GetMapping("/user/{userId}/search")
    public ResponseEntity<List<Document>> searchDocumentsByFileName(
            @PathVariable Long userId,
            @RequestParam("fileName") String fileName) {
        List<Document> documents = documentService.searchDocumentsByFileName(userId, fileName);
        return ResponseEntity.ok(documents);
    }

    // ✅ Delete document by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok("Document deleted successfully");
    }

    // ✅ Download document by ID
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        byte[] fileData = documentService.downloadDocument(id);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=document_" + id + ".bin")
                .body(fileData);
    }

    // ✅ Update document metadata (filename, category, description)
    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(@PathVariable Long id, @RequestBody Document updatedDocument) {
        Document document = documentService.updateDocument(id, updatedDocument);
        return ResponseEntity.ok(document);
    }
}
