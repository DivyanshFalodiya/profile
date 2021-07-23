const faker = require('faker');

function fetchProjects() {
    const data = [];
    for (let i = 0; i < 5; i++) {
        const title = faker.name.jobTitle();
        const image = faker.image.business(200, 200);
        const about = faker.lorem.paragraph(3);
        data.push({ title, image, about });
    }
    return data;
}

module.exports = { fetchProjects };
