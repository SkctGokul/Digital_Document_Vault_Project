package com.digitalvault.digital_vault_backend.service;



import java.util.List;

import com.digitalvault.digital_vault_backend.model.User;

public interface UserService {
    
    User createUser(User user);
    
    User getUserById(Long id);
    
    User getUserByUsername(String username);
    
    User getUserByEmail(String email);
    
    List<User> getAllUsers();
    
    User updateUser(Long id, User user);
    
    void deleteUser(Long id);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}