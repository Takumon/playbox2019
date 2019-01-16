export let users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@gmail.com',
        age: 22
    },
    {
        id: 2,
        name: 'John Doe',
        email: 'john@gmail.com',
        age: 23
    },
];

let idSequence = 2;

export function generateId() {
    idSequence++;
    return idSequence;


}
