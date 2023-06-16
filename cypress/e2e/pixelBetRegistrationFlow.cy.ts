import {
    generateRandomPassword,
    generateRandomEmailAddress,
    generateFirstName,
    generateLastName
} from "../support/helperMethods"
import {RegistrationPage} from '../support/page-objects/registration-page'
import * as apiEndpoints from '../fixtures/apiEndpoints.json'

const registrationPage = new RegistrationPage()

describe('Registration Flow', () => {
    const password = generateRandomPassword()
    const country = 'Malta'
    const city = 'Valetta'
    const street = 'Malta address'
    const postcode = 'postcode'

    const registerUser = (email: string, firstName: string, lastName: string) => {
        registrationPage.enterEmail(email)
        registrationPage.enterPassword(password)
        registrationPage.clickContinueButton()

        registrationPage.selectCountry(country)
        registrationPage.enterCity(city)
        registrationPage.enterStreet(street)
        registrationPage.enterPostcode(postcode)
        registrationPage.clickContinueButton()

        registrationPage.enterFirstName(firstName)
        registrationPage.enterLastName(lastName)
        registrationPage.enterDateOfBirth('09/09/1999')
        registrationPage.clickContinueButton()

        registrationPage.clickOnTermsAndConditionsToggleButton()
        cy.intercept({
            method: 'POST',
            url: apiEndpoints.register,
        }).as(`registerApi`)
        registrationPage.clickContinueButton()
    }

    it('should register new user', () => {
        const email = generateRandomEmailAddress()
        const firstName = generateFirstName()
        const lastName = generateLastName()

        cy.visit('/')
        registrationPage.clickRegisterButton()
        registerUser(email, firstName, lastName)

        cy.wait('@registerApi', {timeout: 30000}).then((register) => {
            expect(register.response.statusCode).to.eq(200)
            expect(register.response.body.result).to.contain('SUCCESS')
            expect(register.response.body.user.email).to.contain(email)
            expect(register.response.body.user.firstName).to.contain(firstName)
            expect(register.response.body.user.lastName).to.contain(lastName)
            expect(register.response.body.user.countryCode).to.contain('MT')
            expect(register.response.body.user.city).to.contain(city)
            expect(register.response.body.user.street).to.contain(street)
            expect(register.response.body.user.postCode).to.contain(postcode)
            expect(register.response.body.user.dateOfBirth).to.contain('1999-09-09')
        })
    })

    it('should not register with the existing email address', () => {
        const email = generateRandomEmailAddress()
        const firstName = generateFirstName()
        const lastName = generateLastName()

        cy.visit('/')
        registrationPage.clickRegisterButton()
        registerUser(email, firstName, lastName)
        cy.wait('@registerApi', {timeout: 30000}).then((register) => {
            expect(register.response.statusCode).to.eq(200)
        })

        cy.clearAllLocalStorage() // to clear pre-populated text fields
        cy.visit('/register')
        registerUser(email, firstName, lastName)
        cy.wait('@registerApi', {timeout: 30000}).then((register) => {
            expect(register.response.statusCode).to.eq(400)
            expect(register.response.body.result).to.contain('ERROR_EMAIL_IN_USE')
        })
        registrationPage.verifyThatEmailAlreadyInUseErrorDisplays()
    })

    it('should check UI validation errors', () => {
        cy.visit('/register')

        // verify email address cannot be invalid
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.enterEmail("test.test.com")
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("Invalid email address")
        registrationPage.checkIfContinueButtonIsDisabled()

        // verify email address cannot be empty
        registrationPage.clearEmailAddressField()
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("E-mail is required")

        // verify password validations - cannot be less than 8 characters, must include at least one number, one capital letter, and one lower letter
        registrationPage.enterEmail("test@test.com")
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.enterPassword("aA")
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.enterPassword("aA12")
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.enterPassword("aA123456")
        registrationPage.clickContinueButton()

        // verify city name cannot have less than 3 characters
        registrationPage.enterCity('te')
        registrationPage.enterStreet('test')
        registrationPage.enterPostcode('test')
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("City is too short")

        // verify street name cannot have less than 3 characters
        registrationPage.enterCity('test')
        registrationPage.enterStreet('te')
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("Address is too short")

        // verify post code cannot have less than 3 characters
        registrationPage.enterStreet('test')
        registrationPage.enterPostcode('te')
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("Post code is too short")

        registrationPage.enterPostcode('test')
        registrationPage.clickContinueButton()
        registrationPage.checkIfContinueButtonIsDisabled()

        // verify first name cannot have less than 3 characters
        registrationPage.enterFirstName('te')
        registrationPage.enterLastName('test')
        registrationPage.enterDateOfBirth('09/09/2000')
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("First Name is too short")

        // verify last name cannot have less than 3 characters
        registrationPage.enterFirstName('test')
        registrationPage.enterLastName('te')
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("Last Name is too short")
        registrationPage.enterLastName('test')

        // verify date of birth cannot be less than 18 years old
        registrationPage.enterDateOfBirth('09/09/2010')
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("You must be 18 years old.")

        // verify date of birth cannot be invalid
        registrationPage.enterDateOfBirth('22/22/2010')
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("Invalid date of birth")
        registrationPage.checkIfContinueButtonIsDisabled()

        registrationPage.enterDateOfBirth('09/09/2000')
        registrationPage.clickContinueButton()

        // verify terms and conditions must be accepted
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.enableThenDisableTerms()
        registrationPage.checkIfContinueButtonIsDisabled()
        registrationPage.verifyErrorDisplayedInTheRegistrationFlow("Terms & Conditions is required")
    })

    it('should check buttons are functional', () => {
        cy.visit('/register')
        registrationPage.enterEmail('test@test.com')
        registrationPage.enterPassword(password)
        registrationPage.verifyPasswordEntryIsHidden()
        registrationPage.clickOnTogglePassword()
        registrationPage.verifyPasswordEntryIsVisible()
        registrationPage.clickContinueButton()
        registrationPage.clickOnGoBackButton()
        registrationPage.verifyHeadlineTextIsDisplayed('Hello Friend')
        registrationPage.clickContinueButton()

        // Needed because zendesk request returns 404, so the test fails
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
        registrationPage.clickOnNeedHelpButton()
        registrationPage.verifyThatNeedHelpWidgetIsVisible()
    })
})