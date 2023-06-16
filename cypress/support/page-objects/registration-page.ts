export class RegistrationPage {

    /**
     * Locators
     */
    registerButton() {
        return cy.get('.menu-text.register-button')
    }

    continueButton() {
        return cy.get('button.btn-cta.cta-light.btn-login.register[type="submit"]')
    }

    countrySelector() {
        return cy.get('[class*=dropdown-with-flags] div[class*="Select--single"]')
    }

    cityField() {
        return cy.get('#city')
    }

    postcodeField() {
        return cy.get('#postCode')
    }

    streetField() {
        return cy.get('#street')
    }

    emailField() {
        return cy.get('#email')
    }

    firstNameField() {
        return cy.get('#firstName')
    }

    lastNameField() {
        return cy.get('#lastName')
    }

    dateOfBirthField() {
        return cy.get('input[name="dateOfBirth"')
    }

    passwordField() {
        return cy.get('#password')
    }

    termsAndConditionsToggleButton() {
        return cy.get('[class=react-toggle]')
    }

    emailAlreadyInUseErrorMessage() {
        return cy.get('.register-error')
    }

    errorMessages() {
        return cy.get('.help-block')
    }

    togglePasswordButton() {
        return cy.get('span[class="toggle-password pixel-eye-icon"]')
    }

    goBackButton() {
        return cy.get('.goback')
    }

    headlineText() {
        return cy.get('.headline')
    }

    needHelpButton() {
        return cy.get('.need-help')
    }

    needHelpWidgetHeader() {
        return cy.get('#webWidget', {timeout: 10000})
    }

    /**
     * Methods
     */
    clickRegisterButton() {
        this.registerButton().click()
    }

    clickContinueButton() {
        this.continueButton().click()
    }

    enterEmail(email: string) {
        this.emailField().clear().type(email)
    }

    enterPassword(password: string) {
        this.passwordField().clear().type(password)
    }

    selectCountry(country: string) {
        this.countrySelector().should('be.visible').click()
        this.countrySelector().type(`${country}{enter}`);
    }

    enterCity(city: string) {
        this.cityField().clear().type(city)
    }

    enterStreet(street: string) {
        this.streetField().clear().type(street)
    }

    enterPostcode(postcode: string) {
        this.postcodeField().clear().type(postcode)
    }

    enterFirstName(firstName: string) {
        this.firstNameField().clear().type(firstName)
    }

    enterLastName(lastName: string) {
        this.lastNameField().clear().type(lastName)
    }

    enterDateOfBirth(dateOfBirth: string) {
        this.dateOfBirthField().clear().type(dateOfBirth)
    }

    clickOnTermsAndConditionsToggleButton() {
        this.termsAndConditionsToggleButton().click()
    }

    verifyThatEmailAlreadyInUseErrorDisplays() {
        this.emailAlreadyInUseErrorMessage().should('have.text', 'Email is already in use.').and('be.visible')
    }

    verifyErrorDisplayedInTheRegistrationFlow(errorText: string) {
        this.errorMessages().contains(errorText).should('be.visible')
    }

    clearEmailAddressField() {
        this.emailField().clear()
    }

    checkIfContinueButtonIsDisabled() {
        this.continueButton().should('be.disabled')
    }

    enableThenDisableTerms() {
        this.termsAndConditionsToggleButton().click().click()
    }

    verifyPasswordEntryIsHidden() {
        this.passwordField().should('have.attr', 'type', 'password')
    }

    verifyPasswordEntryIsVisible() {
        this.passwordField().should('have.attr', 'type', 'text')
    }

    clickOnTogglePassword() {
        this.togglePasswordButton().click()
    }

    clickOnGoBackButton() {
        this.goBackButton().click()
    }

    verifyHeadlineTextIsDisplayed(text: string) {
        this.headlineText().should('contain', text)
    }

    clickOnNeedHelpButton() {
        this.needHelpButton().should('be.visible').click()
    }

    verifyThatNeedHelpWidgetIsVisible() {
        this.needHelpWidgetHeader().should('be.visible')
    }
}