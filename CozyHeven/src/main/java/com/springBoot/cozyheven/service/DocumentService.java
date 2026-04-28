package com.springBoot.cozyheven.service;


import com.springBoot.cozyheven.dto.DocumentReqDto;
import com.springBoot.cozyheven.mapper.DocumentMapper;
import com.springBoot.cozyheven.model.Document;
import com.springBoot.cozyheven.model.Guest;
import com.springBoot.cozyheven.repository.DocumentRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@AllArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final GuestService guestService;
    // Point this to the path of your UI's public folder
    private final static String UPLOAD_PATH = "C:/Users/LENOVO/Downloads/CozyHeven/hotel-ui/public/uploads";


    public DocumentReqDto upload(String customerUsername, MultipartFile file) throws IOException {
        Guest guest = guestService.getByUsername(customerUsername);




        // Create a File handler to save the directory path
        File directory = new File(UPLOAD_PATH);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Fetch the file name :- to save it in DB name.extension -split(.)[1]
        String originalName   = file.getOriginalFilename();
        String uniqueFileName = System.currentTimeMillis() + "_" + originalName;

        Path path = Paths.get(UPLOAD_PATH + "/" + uniqueFileName);
        Files.write(path, file.getBytes());

        //save the path in DB
        Document document = new Document();
        document.setGuest(guest);
        document.setProfileImage(uniqueFileName);

        Document saved = documentRepository.save(document);
        return DocumentMapper.mapToDto(saved);



    }

}

