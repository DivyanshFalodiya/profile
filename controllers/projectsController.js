const faker = require('faker');

function fetchProjects() {
    const data = [];
    for (let i = 0; i < 5; i++) {
        const title = faker.name.jobTitle();
        const image = 'https://picsum.photos/200/300';
        const about = faker.lorem.paragraph(3);
        const link = 'https://github.com/DivyanshFalodiya';
        data.push({ title, image, about, link });
    }
    return data;
}

module.exports = { fetchProjects };
