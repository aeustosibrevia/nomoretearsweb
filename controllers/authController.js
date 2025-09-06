const authService = require('../services/authService');

exports.register = async (req, res, next) => {
    try{
        const result = await authService.register(req.body);
        res.status(201).json(result);
    }
    catch(err){
        next(err);
    }
};

exports.login = async (req, res, next) => {
        try{
            const result = await authService.login(req.body);
            res.json(result);
        }
        catch(err){
            next(err);
        }
};

exports.logout = async (req, res) => {
    await authService.logout(req.user);
    res.json({message : 'Успішний вихід із системи'});
};

exports.getProfile = async (req, res, next) => {
    try{
        const profile = await authService.getProfile(req.user);
        res.json(profile);
    }
    catch(err){
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try{
        const result = await authService.updateProfile(req.user, req.body);
        res.json(result);
    }
    catch(err) {
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    try{
        const result = await authService.changePassword(req.user, req.body);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.requestPasswordReset = async (req, res, next) => {
    try{
        const result = await authService.requestPasswordReset(req.body.email);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try{
        const result = await authService.resetPassword(req.body);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try{
        const result = await authService.getAllUsers(req.user);
        res.json(result);
    }
    catch(err){
        next(err);
    }
}

exports.giveInstructor = async (req, res, next) => {
    try {
        const { username } = req.params;
        const result = await authService.giveInstructor(req.user, username);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.revokeInstructor = async (req, res, next) => {
    try {
        const { username } = req.params;
        const result = await authService.revokeInstructor(req.user, username);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.giveAdmin = async (req, res, next) => {
    try {
        const { username } = req.params;
        const result = await authService.giveAdmin(req.user, username);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.revokeAdmin = async (req, res, next) => {
    try {
        const { username } = req.params;
        const result = await authService.revokeAdmin(req.user, username);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
