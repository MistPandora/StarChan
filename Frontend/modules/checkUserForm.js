export const checkUserForm = (username = "", email = "", password = "", confirmPassword = "") => {
    const usernameRegex = /^[A-Za-zÀ-Üà-ü0-9_-]+$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    // Vérification des caractères spéciaux dans le nom d'utilisateur
    const checkSpecialCharacter = usernameRegex.test(username);

    // Vérification de la longueur du nom d'utilisateur entre 4 et 15 caractères
    const checkUsernameLength = 4 <= username.length && username.length <= 15;

    // Vérification finale de la validité du nom d'utilisateur
    const isUsernameValid = checkSpecialCharacter && checkUsernameLength;

    // Vérification de la validité de l'adresse e-mail et de sa longueur maximale
    const isEmailValid = emailRegex.test(email) && email.length <= 100;

    // Vérification de la longueur du mot de passe entre 8 et 50 caractères
    const isPasswordValid = password.length >= 8 && password.length <= 50;

    // Vérification de la correspondance entre le mot de passe et la confirmation du mot de passe
    const isConfirmPasswordValid = password === confirmPassword;

    // Vérification globale de la validité du formulaire
    const isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

    return {
        checkSpecialCharacter,
        checkUsernameLength,
        isUsernameValid,
        isEmailValid,
        isPasswordValid,
        isConfirmPasswordValid,
        isFormValid
    }
}
