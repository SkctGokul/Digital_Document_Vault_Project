package com.digitalvault.digital_vault_backend.service.impl;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.digitalvault.digital_vault_backend.model.Document;
import com.digitalvault.digital_vault_backend.model.User;
import com.digitalvault.digital_vault_backend.repository.DocumentRepository;
import com.digitalvault.digital_vault_backend.repository.UserRepository;
import com.digitalvault.digital_vault_backend.service.DocumentService;

import java.io.IOException;
import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public Document uploadDocument(MultipartFile file, Long userId, String category, String description) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setFileData(file.getBytes());
        document.setUser(user);
        document.setCategory(category);
        document.setDescription(description);
        
        return documentRepository.save(document);
    }
    
    @Override
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }
    
    @Override
    public List<Document> getAllDocumentsByUserId(Long userId) {
        return documentRepository.findByUserId(userId);
    }
    
    @Override
    public List<Document> getDocumentsByUserIdAndCategory(Long userId, String category) {
        return documentRepository.findByUserIdAndCategory(userId, category);
    }
    
    @Override
    public List<Document> searchDocumentsByFileName(Long userId, String fileName) {
        return documentRepository.findByUserIdAndFileNameContaining(userId, fileName);
    }
    
    @Override
    public void deleteDocument(Long id) {
        Document document = getDocumentById(id);
        documentRepository.delete(document);
    }
    
    @Override
    public byte[] downloadDocument(Long id) {
        Document document = getDocumentById(id);
        return document.getFileData();
    }
}