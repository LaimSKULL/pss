const { Profile, User, Social} = require("../models");
const {checkPermissionUser} = require('../middlewares/verify')
const {Permissions} = require("../utils/enums");
exports.saveDate = async (req, res) => {
    const data = req.body;
    let d = {};
    if (Number(req.params.id)===res.data.user.id && res.data.permission===Permissions.profile.editSelf) {
        switch (data.fieldId) {
            case 'firstName':
            case 'lastName':
            case 'middleName':
            case 'dob':
                await Profile.update({[data.fieldId]: data.value}, {where: {id: req.params.id}});
                break;
            case 'email':
                await User.update({[data.fieldId]: data.value}, {where: {id: req.params.id}});
                break;
            case 'password':
                const user = await User.findByPk(req.params.id);
                if (user) {
                    user.set('hash_password', data.value);
                    await user.save();
                }
                break;
            case 'socialWebsite':
                await Social.update({Web: data.value}, {where: {userId: req.params.id}})
                break
            case 'socialGithub':
                await Social.update({GH: data.value}, {where: {userId: req.params.id}})
                break
            case 'socialTelegram':
                await Social.update({TG: data.value}, {where: {userId: req.params.id}})
                break
            case 'socialVk':
                await Social.update({VK: data.value}, {where: {userId: req.params.id}})
                break
            default:
                console.log(data);
                break;
        }

        return res.status(200).json({message: 'Ok'});
    }
    else if( res.data.permission===Permissions.profile.edit){
        switch (data.fieldId) {
            case 'firstName':
            case 'lastName':
            case 'middleName':
            case 'dob':
                await Profile.update({[data.fieldId]: data.value}, {where: {id: req.params.id}});
                break;
            case 'email':
                await User.update({[data.fieldId]: data.value}, {where: {id: req.params.id}});
                break;
            case 'password':
                const user = await User.findByPk(req.params.id);
                if (user) {
                    user.set('hash_password', data.value);
                    await user.save();
                }
                break;
            case 'socialWebsite':
                await Social.update({Web: data.value}, {where: {userId: req.params.id}})
                break
            case 'socialGithub':
                await Social.update({GH: data.value}, {where: {userId: req.params.id}})
                break
            case 'socialTelegram':
                await Social.update({TG: data.value}, {where: {userId: req.params.id}})
                break
            case 'socialVk':
                await Social.update({VK: data.value}, {where: {userId: req.params.id}})
                break
            default:
                console.log(data);
                break;
        }

        return res.status(200).json({message: 'Ok'});
    } else {
        return res.status(403).json({message:'Error'})
    }
};
