// @flow

// Validation error handler catch and fire mongoose schema validation errors

// Create array of errors
export const getValidationErrors = (err): [error] => {
    const ValidationErrors = {
        REQUIRED: 'required',
        NOTVALID: 'notvalid',
        /* ... */
    };

    const arrays = [];
    if (err.name === 'ValidationError') {
        for (var errName in err.errors) {
            const found = arrays.find(x => x == err.errors[errName].message);
            if (found === 0 || found === undefined) {
                switch (err.errors[errName].kind) {
                case ValidationErrors.REQUIRED:
                    arrays.push(err.errors[errName].message); // Note:  For More Automation ('Field is required')
                    break;
                case ValidationErrors.NOTVALID:
                    arrays.push(err.errors[errName].message);
                    break;
                }
            }
        }
    } else {
        arrays.push('The problem is not validation error');
        return;
    }
    return arrays;
};
