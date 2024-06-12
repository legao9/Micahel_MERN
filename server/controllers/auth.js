import model from '../model/model.js';





//New code to work with my DB, can integrate with StreamChat etc
export const login = async (req, res) => {
    try {
        
        const { username, password } = req.body;
        console.log(username, password);
        const modelInstance = await model(); // Call model as a function to get the object
        const user = await modelInstance.getUserByUsername(username)
        if (user === null) {
            return res.json({ message: 'Incorrect Username or Password' });
        }
        else {
            const success = await modelInstance.validateCredentials(username, password);

            if (success) {
            const uerRow = await modelInstance.getUserByUsername(username);
      
            console.log(uerRow);
          
            res.json({ message: 'Login successful', token: uerRow });
            } else {
                 res.json({ message: 'Incorrect Username or Password' });
             }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
};

