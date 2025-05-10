package com.uor.group_14.touripearl_backend.util;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;

@Service
public class FileExtractor {
    public byte[] blobToByteArray(Blob blob) throws SQLException, IOException {
        if (blob == null) {
            return new byte[0];
        }

        try (InputStream inputStream = blob.getBinaryStream();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int byteRead;

            while ((byteRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, byteRead);
            }
            return outputStream.toByteArray();

        }
    }

    public String extractActualFileName(InputStreamReader streamReader) {
        try {
            StringBuffer buffer = new StringBuffer();
            String temp;
            BufferedReader bufferedReader = new BufferedReader(streamReader);
            while ((temp = bufferedReader.readLine()) != null) {
                buffer.append(temp);
            }
            return buffer.toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String byteArrayToString(byte[] byteArray) {
        if (byteArray == null || byteArray.length == 0) {
            return null;
        }
        return new String(byteArray, StandardCharsets.UTF_8);
    }
}
