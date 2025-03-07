import userService from './user.service.js';

async function registerUser(req, res) {
    try {
        const { firstname, lastname, username, email, password, roles } = req.body;
        const newUser = await userService.createUser(firstname, lastname, username, email, password, roles);
        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        const user = await userService.authenticateUser(username, password);

        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const token = userService.generateToken(user);
        res.status(200).json({ message: 'Authentification réussie', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'authentification', error: error.message });
    }
}

export default {
    registerUser,
    loginUser
};
