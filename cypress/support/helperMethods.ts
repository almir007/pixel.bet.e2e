import * as faker from "faker";

export const generateRandomEmailAddress = (): string => {
    const firstName = faker.name.firstName().toLowerCase()
    const lastName = faker.name.lastName().toLowerCase()
    const randomNumber = Math.floor(Math.random() * 10000)
    return `${firstName}_${lastName}_${randomNumber}@test.com`
};

export const generateRandomPassword = (): string => {
    return `${faker.internet.password()}3`;
};

export const generateFirstName = (): string => {
    const firstName = faker.name.firstName()
    return firstName
}

export const generateLastName = (): string => {
    const firstName = faker.name.lastName()
    return firstName
}


