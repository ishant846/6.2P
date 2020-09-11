'use strict';
module.exports = function(formidable, path) {
    return {
        validateWorker: (req, res, next) => {

			req.checkBody('email', 'Email is required').notEmpty(); 
            req.checkBody('email', 'Email is invalid').isEmail();
            req.checkBody('first_name', 'First Name is required!').notEmpty();
            req.checkBody('last_name', 'Last Name is required!').notEmpty(); 
			req.checkBody('password', 'Password must be 6 or more characters longer').isLength({min : 6});           
			req.checkBody('password', 'Password is required!').notEmpty();
			req.checkBody('country', 'Country is required!').notEmpty(); 
			req.checkBody('address', 'Address is required!').notEmpty(); 
			req.checkBody('contact_number', 'Contact Number is required!').notEmpty(); 
			
			
            req.getValidationResult()
                .then((result) => {
                    
                    var errors = result.array();
                    var messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                    if(messages.length > 0) {
                        res.status(400).json({
							error: true, 
							errors: messages
						});
                    }
                    else {
                        return next();
                    }
                })
                .catch((err) => {
                    throw err;
                })
                
        }
	}
}