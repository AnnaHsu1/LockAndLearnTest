import { describe, expect, test } from "@jest/globals";
import React from "react";
import UploadScreen from "../screens/UploadScreen";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react-native";
import * as DocumentPicker from "expo-document-picker";

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
