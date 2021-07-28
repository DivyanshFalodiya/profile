const faker = require('faker');

function fetchProjects() {
    const data = [];
    for (let i = 0; i < 5; i++) {
        const title = faker.name.jobTitle();
        const about = faker.lorem.paragraph(3);
        const tech = ['python', 'java', 'cplusplus'];
        const image = 'https://source.unsplash.com/random';
        const link = 'https://github.com/DivyanshFalodiya';
        data.push({ title, image, about, link, tech });
    }
    return data;
}

module.exports = { fetchProjects };
