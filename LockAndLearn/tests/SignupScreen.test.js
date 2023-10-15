import { describe, expect, test, beforeAll } from "@jest/globals";
import { render, fireEvent, act } from "@testing-library/react-native";
import SignUpScreen from "../screens/SignupScreen";
// const mongoose = require("mongoose");

describe("Components rendering correctly", () => {

    // Connect to the database before running any tests.
    // beforeAll(async () => {});
    // afterAll(async () => {});

  test("does sign up screen render", () => {
    const { getByTestId } = render(<SignUpScreen />);
  });

  test("complete sign up form", () => {
    const { getByTestId } = render(<SignUpScreen />);

    const email = getByTestId("email-input");
    fireEvent.changeText(email, "email@test.com");
    expect(email.props.value).toBe("email@test.com");

    const firstName = getByTestId("first-name-input");
    fireEvent.changeText(firstName, "testFirst");
    expect(firstName.props.value).toBe("testFirst");

    const lastName = getByTestId("last-name-input");
    fireEvent.changeText(lastName, "testLast");
    expect(lastName.props.value).toBe("testLast");

    const password = getByTestId("password-input");
    fireEvent.changeText(password, "test123@");
    expect(password.props.value).toBe("test123@");

    const cpassword = getByTestId("cpassword-input");
    fireEvent.changeText(cpassword, "test123@");
    expect(cpassword.props.value).toBe("test123@");

    const birthdate = getByTestId("birthdate-input");
    fireEvent.changeText(birthdate, "1999-01-01");
    expect(birthdate.props.value).toBe("1999-01-01");

    // Need to connect to DB first
    // const signupButton = getByTestId("signupButton");
    // fireEvent.press(signupButton);
    // expect(signupButton).toBeDefined();
  });

  test("navigate to login if user already has an account", () => {
    const mockNavigate = jest.fn();

    const { getByTestId } = render(
      <SignUpScreen navigation={{ navigate: mockNavigate }} />
    );

    const loginLink = getByTestId("login-link");
    fireEvent.press(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith("Login");
  });
});
