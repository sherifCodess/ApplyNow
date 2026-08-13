import { describe, it, expect } from "vitest";
import {
    validatePersonal,
    validateAcademic,
    validateGuardian,
} from "../utils/validation.js";

describe("validatePersonal", () => {
    it("returns errors when required personal information is missing", () => {
        const errors = validatePersonal({});

        expect(errors.firstName).toBe("First name is required.");
        expect(errors.lastName).toBe("Last name is required.");
        expect(errors.dateOfBirth).toBe("Date of birth is required.");
        expect(errors.gender).toBe("Gender is required.");
        expect(errors.email).toBe("Email is required.");
        expect(errors.phone).toBe("Phone number is required.");
        expect(errors.address).toBe("Address is required.");
    });

    it("accepts valid personal information", () => {
        const data = {
            firstName: "Sherif",
            lastName: "Abdulazeez",
            dateOfBirth: "2000-01-01",
            gender: "Male",
            email: "sherif@example.com",
            phone: "+2348012345678",
            address: "Lagos, Nigeria",
        };

        const errors = validatePersonal(data);

        expect(errors).toEqual({});
    });

    it("rejects an invalid email", () => {
        const data = {
            firstName: "Sherif",
            lastName: "Abdulazeez",
            dateOfBirth: "2000-01-01",
            gender: "Male",
            email: "invalid-email",
            phone: "+2348012345678",
            address: "Lagos, Nigeria",
        };

        const errors = validatePersonal(data);

        expect(errors.email).toBe("Enter a valid email address.");
    });

    it("rejects an invalid phone number", () => {
        const data = {
            firstName: "Sherif",
            lastName: "Abdulazeez",
            dateOfBirth: "2000-01-01",
            gender: "Male",
            email: "sherif@example.com",
            phone: "abc",
            address: "Lagos, Nigeria",
        };

        const errors = validatePersonal(data);

        expect(errors.phone).toBe("Enter a valid phone number.");
    });
});


describe("validateAcademic", () => {
    it("returns errors when required academic information is missing", () => {
        const errors = validateAcademic({});

        expect(errors.previousSchool).toBe("Previous school is required.");
        expect(errors.qualification).toBe("Qualification is required.");
        expect(errors.graduationYear).toBe("Graduation year is required.");
        expect(errors.gpa).toBe("GPA is required.");
        expect(errors.programme).toBe("Intended programme is required.");
    });

    it("accepts valid academic information", () => {
        const data = {
            previousSchool: "University of Lagos",
            qualification: "BSc",
            graduationYear: "2024",
            gpa: "4.2",
            programme: "Computer Science",
        };

        const errors = validateAcademic(data);

        expect(errors).toEqual({});
    });

    it("rejects an invalid graduation year", () => {
        const data = {
            previousSchool: "University of Lagos",
            qualification: "BSc",
            graduationYear: "1970",
            gpa: "4.2",
            programme: "Computer Science",
        };

        const errors = validateAcademic(data);

        expect(errors.graduationYear).toBe(
            "Enter a valid graduation year."
        );
    });

    it("rejects a GPA outside the allowed range", () => {
        const data = {
            previousSchool: "University of Lagos",
            qualification: "BSc",
            graduationYear: "2024",
            gpa: "6",
            programme: "Computer Science",
        };

        const errors = validateAcademic(data);

        expect(errors.gpa).toBe(
            "GPA must be a number between 0 and 5."
        );
    });
});


describe("validateGuardian", () => {
    it("returns errors when required guardian information is missing", () => {
        const errors = validateGuardian({});

        expect(errors.guardianName).toBe("Guardian name is required.");
        expect(errors.relationship).toBe("Relationship is required.");
        expect(errors.guardianPhone).toBe("Guardian phone is required.");
        expect(errors.guardianAddress).toBe("Guardian address is required.");
    });

    it("accepts valid guardian information", () => {
        const data = {
            guardianName: "Ahmed Abdulazeez",
            relationship: "Father",
            guardianPhone: "+2348012345678",
            guardianEmail: "ahmed@example.com",
            guardianAddress: "Lagos, Nigeria",
        };

        const errors = validateGuardian(data);

        expect(errors).toEqual({});
    });

    it("rejects an invalid guardian email", () => {
        const data = {
            guardianName: "Ahmed Abdulazeez",
            relationship: "Father",
            guardianPhone: "+2348012345678",
            guardianEmail: "wrong-email",
            guardianAddress: "Lagos, Nigeria",
        };

        const errors = validateGuardian(data);

        expect(errors.guardianEmail).toBe(
            "Enter a valid email address."
        );
    });
});