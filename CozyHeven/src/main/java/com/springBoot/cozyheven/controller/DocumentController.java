package com.springBoot.cozyheven.controller;


import com.springBoot.cozyheven.dto.DocumentReqDto;
import com.springBoot.cozyheven.model.Document;
import com.springBoot.cozyheven.service.DocumentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@AllArgsConstructor
@RequestMapping("/api/document")
@CrossOrigin(origins = "http://localhost:5173/")
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping("/upload")
    public DocumentReqDto upload(Principal principal,
                                 @RequestParam("file") MultipartFile file) throws IOException {
        String customerUsername = principal.getName();
        return documentService.upload(customerUsername,file);
    }
}
