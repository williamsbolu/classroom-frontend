import { Subject } from "../types";

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    description:
      "An introductory course covering the fundamental concepts of computer science and programming.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: "MATH201",
    name: "Calculus II",
    department: "Mathematics",
    description:
      "Advanced study of integration, sequences, series, and power series.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: "ENG102",
    name: "Literature and Composition",
    department: "English",
    description:
      "A course focused on critical reading and writing through the study of various literary genres.",
    createdAt: new Date().toISOString(),
  },
];

export const teachers = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Smith",
  },
  {
    id: "3",
    name: "Dr. Alan Turing",
  },
];

export const subjects = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH",
  },
  {
    id: 2,
    name: "Computer Science",
    code: "CS",
  },
  {
    id: 3,
    name: "Physics",
    code: "PHY",
  },
  {
    id: 4,
    name: "Chemistry",
    code: "CHEM",
  },
];
