export default class ErrorUtils {

	static parseError(errorMessage: string, provider?: string): string {
		if (errorMessage.includes("auth/invalid-email")) {
			return "Badly formatted email.";
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
		if (errorMessage.includes("auth/weak-password")) {
			return "Password should be at least 6 characters.";
		}
		if (errorMessage.includes("auth/popup-closed-by-user")) {
			return "The authentication window was closed."
		}
		if (errorMessage.includes("auth/account-exists-with-different-credential")) {
			return "Account already exists. Try signing with " + provider;
		}
		return "Unknown authentication error occured";
	}
	
}
