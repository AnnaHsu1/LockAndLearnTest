import { describe, expect, test } from "@jest/globals";
import React from "react";
import UploadScreen from "../screens/UploadScreen";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as DocumentPicker from "expo-document-picker";
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();
const FormData = require('form-data');

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn().mockReturnValue({
    assets: [
      {
        name: "test.pdf",
        uri: "file://root/test.pdf"
      }
    ]
  })
}));

// Using uploadFilesHandler function from EditUploadScreen 
const uploadFilesHandler = async (fileData) => {
  await fetch("http://localhost:4000/files/uploadFiles", {
    method: "POST",
    body: fileData
  })
};

describe('uploadFilesHandler', () => {
  it('make POST request and test connection to server', async () => {
    // Mock response
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'File uploaded' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Mock test file
    const fs = require('fs'); 
    const fileStream = fs.createReadStream('example.txt');
    const formData = new FormData();
    formData.append('files', fileStream, 'example.txt');
    
    // Check fetch is called with its expected URL, method and body
    await uploadFilesHandler(formData);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/files/uploadFiles', {
      method: 'POST',
      body: formData,
    });

    // Check response message afect sending to server
    const response = await fetch("http://localhost:4000/files/uploadFiles", {
    method: "POST",
    body: formData
    });
    if (response.status) {
      expect(response.status).toBe(200);
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        expect(data.message).toBe('File uploaded');
      };
    }; 
  });
});

describe("upload file tests", () => {
  test("select button is working as expected by opening file picker", async () => {
    const { getByTestId } = render(<UploadScreen />);
    const selectButton = getByTestId("selectButton");
    fireEvent.press(selectButton);

    expect(selectButton).toBeDefined();
    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
    });
  });

  test("upload button is shown on screen and working", () => {
    const { getByTestId } = render(<UploadScreen />);
    const uploadButton = getByTestId("uploadButton");
    fireEvent.press(uploadButton);

    expect(uploadButton).toBeDefined();
  });
});
