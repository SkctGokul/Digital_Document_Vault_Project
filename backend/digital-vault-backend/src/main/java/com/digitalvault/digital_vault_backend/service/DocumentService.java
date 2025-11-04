package com.digitalvault.digital_vault_backend.service;


import org.springframework.web.multipart.MultipartFile;

import com.digitalvault.digital_vault_backend.model.Document;

import java.io.IOException;
import java.util.List;

public interface DocumentService {
    
    Document uploadDocument(MultipartFile file, Long userId, String category, String description) throws IOException;
    
    Document getDocumentById(Long id);
    
    List<Document> getAllDocumentsByUserId(Long userId);
    
    List<Document> getDocumentsByUserIdAndCategory(Long userId, String category);
    
    List<Document> searchDocumentsByFileName(Long userId, String fileName);
    
    void deleteDocument(Long id);
    
    byte[] downloadDocument(Long id);
}