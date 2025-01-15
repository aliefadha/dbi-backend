module.exports = function (plop) {
    // Register custom helpers  
    plop.addHelper('camelCase', (text) => {
        return text.charAt(0).toLowerCase() + text.slice(1);
    });

    plop.addHelper('pascalCase', (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    });

    plop.addHelper('snakeCase', (text) => {
        return text.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().replace(/\s+/g, '_');
    });
    plop.addHelper('ulerCase', (text) => {
        return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
    })

    plop.setGenerator('component', {
        description: 'Create a new model, service, controller, and route',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Component name please (e.g., Toko):',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/models/{{camelCase name}}.js',
                templateFile: 'plop-templates/model.hbs',
            },
            {
                type: 'add',
                path: 'src/services/{{camelCase name}}Service.js',
                templateFile: 'plop-templates/service.hbs',
            },
            {
                type: 'add',
                path: 'src/controllers/{{camelCase name}}Controller.js',
                templateFile: 'plop-templates/controller.hbs',
            },
            {
                type: 'add',
                path: 'src/routes/{{camelCase name}}Routes.js',
                templateFile: 'plop-templates/routes.hbs',
            },
        ],
    });
};  
