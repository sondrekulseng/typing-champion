export default class ErrorUtils {
	static parseError(errorMessage: string): string {
		if (errorMessage.includes("auth/invalid-email")) {
			return "Badly formatted email";
		}
		if (errorMessage.includes("auth/invalid-credential")) {
			return "Wrong email or password. Try again.";
		}
		if (errorMessage.includes("auth/email-already-in-use")) {
			return "Email already in use.";
		}
		if (errorMessage.includes("auth/missing-password")) {
			return "Please enter a password.";
		}
		if(errorMessage.includes("auth/weak-password")) {
			return "Password should be atleast 6 characters.";
		}
	}
}