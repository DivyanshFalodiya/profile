const router = require('express').Router();

router.get('/', (req, res) => {
    skills = [
        'devicon-cplusplus-plain',
        'devicon-java-plain',
        'devicon-c-plain',
        'devicon-python-plain',
        'devicon-kotlin-plain',
        'devicon-javascript-plain',
        'devicon-jquery-plain',
        'devicon-npm-original-wordmark',
        'devicon-numpy-original',
        'devicon-html5-plain',
        'devicon-css3-plain',
        'devicon-bootstrap-plain',
        'devicon-materialui-plain',
        'devicon-mongodb-plain',
        'devicon-mysql-plain',
        'devicon-threejs-original',
        'devicon-nodejs-plain',
        'devicon-react-plain',
        'devicon-nextjs-plain',
        'devicon-firebase-plain',
        'devicon-socketio-original',
        'devicon-android-plain',
        'devicon-gradle-plain',
        'devicon-heroku-plain',
        'devicon-illustrator-plain',
        'devicon-gimp-plain',
        'devicon-visualstudio-plain',
        'devicon-vscode-plain',
        'devicon-xd-plain',
        'devicon-trello-plain',
        'devicon-git-plain',
        'devicon-github-plain',
    ];
    res.render('index', { skills: skills });
});

module.exports = router;
