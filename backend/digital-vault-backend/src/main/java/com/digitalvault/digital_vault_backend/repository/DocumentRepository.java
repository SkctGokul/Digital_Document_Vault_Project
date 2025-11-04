package com.digitalvault.digital_vault_backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.digitalvault.digital_vault_backend.model.Document;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByUserId(Long userId);
    
    List<Document> findByUserIdAndCategory(Long userId, String category);
    
    List<Document> findByUserIdAndFileNameContaining(Long userId, String fileName);
}
