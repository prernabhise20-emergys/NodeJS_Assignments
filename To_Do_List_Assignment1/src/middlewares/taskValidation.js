const toLower = require('../utility/bodyConverter');

const bodyValidator = (schema) => {
    return (req, res, next) => {
        try {

            const { error } =schema.validate(req.body);
            if (error) {
                throw error;
            }

            next(); 
        } catch (err) {
            console.log('err: ', err);
            res.status(400).json({ error: err.message });  
        }
    };
};

module.exports = {
    bodyValidator,
};
