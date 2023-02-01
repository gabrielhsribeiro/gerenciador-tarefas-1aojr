import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '../../middlewares/connectToDB';
import { UserModel } from '../../models/User';
import { DefaultMessageResponse } from '../../types/DefaultMessageResponse';
import CryptoJS from "crypto-js";
import jwt from 'jsonwebtoken';
import { User } from '../../types/User';
import { validateUserAPI } from '../../context/validateAPI';

const endpoint = async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse | any>) => {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({error: 'Método informado não existe'});
        }

        const {MY_SECRET_KEY} = process.env;
        if(!MY_SECRET_KEY){
            return res.status(500).json({error : 'Env MY_SECRET_KEY não informada'});
        }

        if (!req.body) {
            return res.status(400).json({error: 'Favor informar os dados para autenticação'});
        }

        const user = req.body as User;

        const error_msg=validateUserAPI(user.name,user.email,user.password);
        if(error_msg!==''){
            return res.status(400).json({error: error_msg});
        }

        const existsWithSameEmail = await UserModel.find({email: user.email});
        if(existsWithSameEmail && existsWithSameEmail.length > 0){
            return res.status(400).json({error: 'Email já cadastrado'});
        }

        user.password = CryptoJS.AES.encrypt(user.password, MY_SECRET_KEY).toString();

        await UserModel.create(user);
        const userInsertedDB = await UserModel.find({email: user.email});
        const userInserted = userInsertedDB[0] as User;

        //a API de usuário vai retornar o token para permitir que, ao fazer o cadastro, já seja feito o login sem precisar chamar a API de login
        const token = jwt.sign({_id: userInserted._id}, MY_SECRET_KEY);
        const result = {
            token,
            name: user.name,
            email: user.email
        }
        return res.status(200).json(result);
    } catch (e: any) {
        console.log('Ocorreu erro ao cadastrar usuário:', e);
        return res.status(500).json({error: 'Ocorreu erro ao cadastrar usuário, tente novamente...'});
    }
}

export default connectToDB(endpoint);